import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ServiceOrderService } from '../../services/service-order.service';
import { ClientService } from '../../../clients/services/client.service';
import { ServiceTypeService } from '../../../service-types/services/service-type.service';
import { UserService } from '../../../users/services/user.service';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      let day: string = date.getDate().toString();
      day = +day < 10 ? '0' + day : day;
      let month: string = (date.getMonth() + 1).toString();
      month = +month < 10 ? '0' + month : month;
      let year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return super.format(date, displayFormat);
  }
}

export const CUSTOM_DATE_FORMATS = {
  parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
  display: {
    dateInput: 'input',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-service-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
  templateUrl: './service-order-form.component.html',
  styleUrls: ['./service-order-form.component.scss']
})
export class ServiceOrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  isEditMode = false;
  orderId: string | null = null;

  // Catálogos
  clients: any[] = [];
  projects: any[] = [];
  serviceTypes: any[] = [];
  statuses: any[] = [];
  users: any[] = [];
  distributionConcepts: any[] = [];
  currencies: any[] = [];
  responsiblesCatalog: any[] = [];
  selectedCurrencyCode: string = '';

  priorities = [
    { value: 1, label: 'Baja' },
    { value: 2, label: 'Media' },
    { value: 3, label: 'Alta' },
    { value: 4, label: 'Urgente' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private serviceOrderService: ServiceOrderService,
    private clientService: ClientService,
    private serviceTypeService: ServiceTypeService,
    private userService: UserService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCatalogs();
    
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.isEditMode = true;
      this.loadOrderData(this.orderId);
    }
  }

  createForm(): void {
    const today = new Date();
    this.orderForm = this.fb.group({
      orderNumber: ['', Validators.required],
      requestDate: [today],
      clientId: ['', Validators.required],
      projectId: [''],
      serviceTypeId: ['', Validators.required],
      statusId: ['', Validators.required],
      priority: [2, Validators.required],
      description: [''],
      currencyId: ['', Validators.required],
      foreignAmount: [0, [Validators.min(0)]],
      exchangeRateAtBudget: [1, [Validators.min(1)]],
      exchangeRateAtCollection: [null],
      budgetedAmount: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      estimatedStartDate: [today],
      estimatedEndDate: [today],
      actualStartDate: [today],
      actualEndDate: [today],
      collectionDate: [today],
      distributions: this.fb.array([]),
      responsibleIds: [[], Validators.required] // Array of strings (dropdown multiple)
    });

    // Detectar cambio de moneda para setear la lógica de montos
    this.orderForm.get('currencyId')?.valueChanges.subscribe(val => {
      const selected = this.currencies.find(c => c.id === val);
      if (selected) {
        this.selectedCurrencyCode = selected.code;
        this.calculateTotal(); // Re-calcula por si cambió a una moneda extranjera
      }
    });

    // Calcular Total Amount automáticamente
    this.orderForm.get('foreignAmount')?.valueChanges.subscribe(() => this.calculateTotal());
    this.orderForm.get('exchangeRateAtBudget')?.valueChanges.subscribe(() => this.calculateTotal());
    this.orderForm.get('budgetedAmount')?.valueChanges.subscribe(() => this.calculateTotal());
    this.orderForm.get('discount')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  calculateTotal() {
    let budget = this.orderForm.get('budgetedAmount')?.value || 0;
    
    // Si la moneda seleccionada no es la local (ej. ARS)
    if (this.selectedCurrencyCode && this.selectedCurrencyCode !== 'ARS') {
      const foreignAmount = this.orderForm.get('foreignAmount')?.value || 0;
      const rate = this.orderForm.get('exchangeRateAtBudget')?.value || 1;
      budget = foreignAmount * rate;
      this.orderForm.get('budgetedAmount')?.setValue(budget, { emitEvent: false });
    }

    const discount = this.orderForm.get('discount')?.value || 0;
    const finalTotal = budget - discount;
    this.orderForm.get('totalAmount')?.setValue(finalTotal, { emitEvent: false });
    
    // Recalcular montos de distribución cuando cambian los totales
    this.recalculateDistributions(finalTotal, budget);
  }

  recalculateDistributions(finalTotal: number, budget: number) {
    const baseAmount = finalTotal > 0 ? finalTotal : budget;
    const distArray = this.distributions;
    for (let i = 0; i < distArray.length; i++) {
      const group = distArray.at(i) as FormGroup;
      const percentage = group.get('percentage')?.value || 0;
      const expectedAmount = (percentage / 100) * baseAmount;
      group.get('expectedAmount')?.setValue(expectedAmount, { emitEvent: false });
    }
  }

  get distributions(): FormArray {
    return this.orderForm.get('distributions') as FormArray;
  }

  addDistribution() {
    const group = this.fb.group({
      distributionConceptId: ['', Validators.required],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      expectedAmount: [0],
      actualAmount: [0]
    });

    // Suscribirse a cambios en porcentaje para este item
    group.get('percentage')?.valueChanges.subscribe(() => {
      const finalTotal = this.orderForm.get('totalAmount')?.value || 0;
      const budget = this.orderForm.get('budgetedAmount')?.value || 0;
      this.recalculateDistributions(finalTotal, budget);
    });

    this.distributions.push(group);
  }

  removeDistribution(index: number) {
    this.distributions.removeAt(index);
  }

  // Carga de catálogos
  loadCatalogs(): void {
    this.clientService.getClients().subscribe(res => this.clients = res);
    this.serviceTypeService.getServiceTypes().subscribe(res => this.serviceTypes = res);
    this.userService.getUsers().subscribe(res => this.users = res);
    
    this.serviceOrderService.getStatuses().subscribe(res => this.statuses = res);
    this.serviceOrderService.getProjects().subscribe(res => this.projects = res);
    this.serviceOrderService.getDistributionConcepts().subscribe(res => this.distributionConcepts = res);
    
    this.serviceOrderService.getCurrencies().subscribe(res => this.currencies = res);
    this.serviceOrderService.getResponsiblesCatalog().subscribe(res => this.responsiblesCatalog = res);
  }

  loadOrderData(id: string): void {
    this.serviceOrderService.getServiceOrderById(id).subscribe({
      next: (order) => {
        this.orderForm.patchValue({
          orderNumber: order.orderNumber,
          requestDate: order.requestDate,
          clientId: order.clientId,
          projectId: order.projectId,
          serviceTypeId: order.serviceTypeId,
          statusId: order.statusId,
          priority: order.priorityValue,
          description: order.description,
          currencyId: order.currencyId,
          foreignAmount: order.foreignAmount,
          exchangeRateAtBudget: order.exchangeRateAtBudget,
          exchangeRateAtCollection: order.exchangeRateAtCollection,
          budgetedAmount: order.budgetedAmount,
          discount: order.discount,
          totalAmount: order.totalAmount,
          estimatedStartDate: order.estimatedStartDate,
          estimatedEndDate: order.estimatedEndDate,
          actualStartDate: order.actualStartDate,
          actualEndDate: order.actualEndDate,
          collectionDate: order.collectionDate,
          responsibleIds: order.responsibles ? order.responsibles.map(r => r.id) : []
        });

        // Cargar distribuciones
        order.distributions.forEach(d => {
          this.addDistribution();
          const newGroup = this.distributions.at(this.distributions.length - 1);
          newGroup.patchValue({
            distributionConceptId: d.distributionConceptId,
            percentage: d.percentage,
            expectedAmount: d.expectedAmount,
            actualAmount: d.actualAmount
          });
        });
      },
      error: () => this.snackBar.open('Error al cargar la orden', 'Cerrar', { duration: 3000 })
    });
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.snackBar.open('Por favor, revise los campos del formulario.', 'Cerrar', { duration: 3000 });
      return;
    }

    const formValue = this.orderForm.value;

    // Validación custom de porcentajes
    if (formValue.distributions && formValue.distributions.length > 0) {
      const totalPercentage = formValue.distributions.reduce((acc: number, curr: any) => acc + curr.percentage, 0);
      if (totalPercentage !== 100) {
        this.snackBar.open('La suma de los porcentajes de distribución debe ser exactamente 100.', 'Cerrar', { duration: 4000 });
        return;
      }
    }

    if (this.isEditMode && this.orderId) {
      this.serviceOrderService.updateServiceOrder(this.orderId, formValue).subscribe({
        next: () => {
          this.snackBar.open('Orden actualizada con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/ordenes-servicio']);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error al actualizar', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.serviceOrderService.createServiceOrder(formValue).subscribe({
        next: () => {
          this.snackBar.open('Orden creada con éxito', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/ordenes-servicio']);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error al crear', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/ordenes-servicio']);
  }
}
