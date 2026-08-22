import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// ngx-mask
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { ServiceOrderService } from '../../services/service-order.service';
import { ClientService } from '../../../clients/services/client.service';
import { ServiceTypeService } from '../../../service-types/services/service-type.service';
import { UserService } from '../../../users/services/user.service';
import { ServiceOrderObservationsComponent } from '../service-order-observations/service-order-observations.component';
import { CopyOrderDetailsDialogComponent } from '../copy-order-details-dialog/copy-order-details-dialog.component';
import { CopyBillingDistributionDialogComponent } from '../copy-billing-distribution-dialog/copy-billing-distribution-dialog.component';
import { CopyOperativeActivitiesDialogComponent } from '../copy-operative-activities-dialog/copy-operative-activities-dialog.component';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DirectCostService } from '../../services/direct-cost.service';
import { DirectCost } from '../../models/direct-cost.model';
import { DirectCostDialogComponent } from '../direct-cost-dialog/direct-cost-dialog.component';

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
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTableModule,
    MatProgressSpinnerModule,
    NgxMaskDirective,
    ServiceOrderObservationsComponent,
    MatDialogModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    provideNgxMask()
  ],
  templateUrl: './service-order-form.component.html',
  styleUrls: ['./service-order-form.component.scss']
})
export class ServiceOrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  isEditMode = false;
  orderId: string | null = null;
  isSaving = false;

  // Variables para Costos Directos
  directCostsDataSource = new MatTableDataSource<DirectCost>();
  directCostsColumns: string[] = ['category', 'provider', 'description', 'quantity', 'unit', 'unitPrice', 'totalAmount', 'actions'];
  isLoadingCosts = false;

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

  observations: any[] = [];
  newObservationText: string = '';
  isSavingObservation = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private serviceOrderService: ServiceOrderService,
    private clientService: ClientService,
    private serviceTypeService: ServiceTypeService,
    private userService: UserService,
    private dialog: MatDialog,
    private directCostService: DirectCostService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCatalogs();
    
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.isEditMode = true;
      this.loadOrderData(this.orderId);
      this.loadDirectCosts();
    }
  }

  createForm(): void {
    const today = new Date();
    this.orderForm = this.fb.group({
      orderNumber: ['', Validators.required],
      requestDate: [today, Validators.required],
      clientId: ['', Validators.required],
      projectId: [''],
      serviceTypeId: ['', Validators.required],
      statusId: ['', Validators.required],
      priority: [2, Validators.required],
      description: [''],
      budgetedTasksDetail: [''],
      currencyId: ['', Validators.required],
      foreignAmount: [0, [Validators.min(0)]],
      exchangeRateAtBudget: [1, [Validators.min(1)]],
      exchangeRateAtCollection: [null],
      budgetedAmount: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      collectedAmount: [0, [Validators.min(0)]],
      estimatedStartDate: [today, Validators.required],
      estimatedEndDate: [today, Validators.required],
      actualStartDate: [null],   // opcional
      actualEndDate: [null],     // opcional
      collectionDate: [null],    // opcional
      distributions: this.fb.array([]),
      activities: this.fb.array([]),
      responsibleIds: [[], Validators.required]
    });

    // Detectar cambio de moneda para setear la lógica de montos
    this.orderForm.get('currencyId')?.valueChanges.subscribe(val => {
      const selected = this.currencies.find(c => c.id === val);
      if (selected) {
        this.selectedCurrencyCode = selected.code;
        this.calculateTotal();
      }
    });

    // Calcular Total Amount automáticamente
    this.orderForm.get('foreignAmount')?.valueChanges.subscribe(() => this.calculateTotal());
    this.orderForm.get('exchangeRateAtBudget')?.valueChanges.subscribe(() => this.calculateTotal());
    this.orderForm.get('budgetedAmount')?.valueChanges.subscribe(() => this.calculateTotal());
    this.orderForm.get('discount')?.valueChanges.subscribe(() => this.calculateTotal());

    // Auto-copy fechas presupuestadas → reales
    this.orderForm.get('estimatedStartDate')?.valueChanges.subscribe(val => {
      if (val) {
        this.orderForm.get('actualStartDate')?.setValue(val, { emitEvent: false });
      }
    });
    this.orderForm.get('estimatedEndDate')?.valueChanges.subscribe(val => {
      if (val) {
        this.orderForm.get('actualEndDate')?.setValue(val, { emitEvent: false });
      }
    });
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

  get totalDistributionPercentage(): number {
    return this.distributions.controls.reduce((sum, ctrl) => sum + (Number(ctrl.get('percentage')?.value) || 0), 0);
  }

  get totalDistributionExpected(): number {
    return this.distributions.controls.reduce((sum, ctrl) => sum + (Number(ctrl.get('expectedAmount')?.value) || 0), 0);
  }

  get totalDistributionActual(): number {
    return this.distributions.controls.reduce((sum, ctrl) => sum + (Number(ctrl.get('actualAmount')?.value) || 0), 0);
  }

  isFechasInvalid(): boolean {
    const req = this.orderForm.get('requestDate');
    const start = this.orderForm.get('estimatedStartDate');
    const end = this.orderForm.get('estimatedEndDate');
    const isInvalid = !!(req?.invalid || start?.invalid || end?.invalid);
    const isTouched = !!(req?.touched || start?.touched || end?.touched || this.orderForm.touched);
    return isInvalid && isTouched;
  }

  isFechasComplete(): boolean {
    const req = this.orderForm.get('requestDate');
    const start = this.orderForm.get('estimatedStartDate');
    const end = this.orderForm.get('estimatedEndDate');
    return !!(req?.valid && start?.valid && end?.valid);
  }

  isFinanzasInvalid(): boolean {
    const budget = this.orderForm.get('budgetedAmount');
    const currency = this.orderForm.get('currencyId');
    const isInvalid = !!(budget?.invalid || currency?.invalid || (this.distributions.length > 0 && this.totalDistributionPercentage !== 100));
    const isTouched = !!(budget?.touched || currency?.touched || this.orderForm.touched);
    return isInvalid && isTouched;
  }

  isFinanzasComplete(): boolean {
    const budget = this.orderForm.get('budgetedAmount');
    const currency = this.orderForm.get('currencyId');
    const validFields = !!(budget?.valid && currency?.valid);
    const validDist = this.distributions.length === 0 || this.totalDistributionPercentage === 100;
    return validFields && validDist;
  }

  isEquipoInvalid(): boolean {
    const resp = this.orderForm.get('responsibleIds');
    return !!(resp?.invalid && (resp?.touched || this.orderForm.touched));
  }

  isEquipoComplete(): boolean {
    return !!this.orderForm.get('responsibleIds')?.valid;
  }

  get activities(): FormArray {
    return this.orderForm.get('activities') as FormArray;
  }

  addActivity() {
    this.activities.push(this.fb.group({
      shortDetail: ['', Validators.required],
      longDetail: [''],
      status: ['Pendiente'],
      progressPercentage: [0, [Validators.min(0), Validators.max(100)]]
    }));
  }

  removeActivity(index: number) {
    this.activities.removeAt(index);
  }

  // Carga de catálogos
  loadCatalogs(): void {
    this.clientService.getClients().subscribe(res => this.clients = res);
    this.serviceTypeService.getServiceTypes().subscribe(res => this.serviceTypes = res);
    this.userService.getUsers().subscribe(res => this.users = res);
    
    this.serviceOrderService.getStatuses().subscribe(res => this.statuses = res);
    this.serviceOrderService.getProjects().subscribe(res => this.projects = res);
    this.serviceOrderService.getDistributionConcepts().subscribe(res => this.distributionConcepts = res);
    
    this.serviceOrderService.getCurrencies().subscribe(res => {
      this.currencies = res;
      if (!this.isEditMode) {
        const ars = this.currencies.find(c => c.code === 'ARS');
        if (ars) {
          this.orderForm.get('currencyId')?.setValue(ars.id);
        }
      }
    });
    this.serviceOrderService.getResponsiblesCatalog().subscribe(res => this.responsiblesCatalog = res);
  }

  loadOrderData(id: string): void {
    this.serviceOrderService.getServiceOrderById(id).subscribe({
      next: (order) => {
        // Helper para convertir string ISO a Date para el datepicker
        const toDate = (val: any) => val ? new Date(val) : null;

        this.orderForm.patchValue({
          orderNumber: order.orderNumber,
          requestDate: toDate(order.requestDate),
          clientId: order.clientId,
          projectId: order.projectId ?? '',
          serviceTypeId: order.serviceTypeId,
          statusId: order.statusId,
          priority: order.priorityValue,
          description: order.description,
          budgetedTasksDetail: order.budgetedTasksDetail ?? '',
          currencyId: order.currencyId,
          foreignAmount: order.foreignAmount ?? 0,
          exchangeRateAtBudget: order.exchangeRateAtBudget ?? 1,
          exchangeRateAtCollection: order.exchangeRateAtCollection,
          budgetedAmount: order.budgetedAmount,
          discount: order.discount,
          totalAmount: order.totalAmount,
          collectedAmount: order.collectedAmount ?? 0,
          estimatedStartDate: toDate(order.estimatedStartDate),
          estimatedEndDate: toDate(order.estimatedEndDate),
          actualStartDate: toDate(order.actualStartDate),
          actualEndDate: toDate(order.actualEndDate),
          collectionDate: toDate(order.collectionDate),
          responsibleIds: order.responsibles ? order.responsibles.map((r: any) => r.id) : []
        });

        // Actualizar la moneda seleccionada para que funcione el selector de tipo de cambio
        const selectedCurrency = this.currencies.find(c => c.id === order.currencyId);
        if (selectedCurrency) this.selectedCurrencyCode = selectedCurrency.code;

        // Cargar distribuciones
        order.distributions?.forEach((d: any) => {
          this.addDistribution();
          const newGroup = this.distributions.at(this.distributions.length - 1);
          newGroup.patchValue({
            distributionConceptId: d.distributionConceptId,
            percentage: d.percentage,
            expectedAmount: d.expectedAmount,
            actualAmount: d.actualAmount
          });
        });

        // Cargar actividades
        order.activities?.forEach((a: any) => {
          this.addActivity();
          const newGroup = this.activities.at(this.activities.length - 1);
          newGroup.patchValue({
            shortDetail: a.shortDetail,
            longDetail: a.longDetail,
            status: a.state,
            progressPercentage: a.progressPercentage
          });
        });

        // Cargar observaciones
        this.observations = order.observations ?? [];
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

    const formValue = { ...this.orderForm.value };
    if (formValue.projectId === '') {
      formValue.projectId = null;
    }
    
    // Helper para limpiar montos numéricos que pueden venir como string (ngx-mask) o como number puro
    const parseAmount = (val: any): number => {
      if (val === null || val === undefined || val === '') return 0;
      if (typeof val === 'number') return Number(val.toFixed(2)); // Redondear a 2 decimales para evitar basuras de punto flotante
      // Si es string (ngx-mask: "1.538.600,00")
      return Number(val.toString().replace(/\./g, '').replace(',', '.')) || 0;
    };

    formValue.budgetedAmount = parseAmount(formValue.budgetedAmount);
    formValue.discount = parseAmount(formValue.discount);
    formValue.foreignAmount = parseAmount(formValue.foreignAmount);
    formValue.totalAmount = parseAmount(formValue.totalAmount);

    if (formValue.exchangeRateAtBudget) {
        formValue.exchangeRateAtBudget = parseAmount(formValue.exchangeRateAtBudget);
    }
    if (formValue.exchangeRateAtCollection) {
        formValue.exchangeRateAtCollection = parseAmount(formValue.exchangeRateAtCollection);
    }

    if (formValue.distributions && formValue.distributions.length > 0) {
      formValue.distributions = formValue.distributions.map((d: any) => ({
        ...d,
        percentage: parseAmount(d.percentage),
        expectedAmount: parseAmount(d.expectedAmount),
        actualAmount: parseAmount(d.actualAmount)
      }));
    }

    if (formValue.activities && formValue.activities.length > 0) {
      formValue.activities = formValue.activities.map((a: any) => ({
        ...a,
        state: a.status
      }));
    }

    // Validación custom de porcentajes
    if (formValue.distributions && formValue.distributions.length > 0) {
      const totalPercentage = formValue.distributions.reduce((acc: number, curr: any) => acc + (Number(curr.percentage) || 0), 0);
      if (totalPercentage !== 100) {
        this.snackBar.open('La suma de los porcentajes de distribución debe ser exactamente 100.', 'Cerrar', { duration: 4000 });
        return;
      }
    }

    this.isSaving = true;
    if (this.isEditMode && this.orderId) {
      this.serviceOrderService.updateServiceOrder(this.orderId, formValue).subscribe({
        next: () => {
          this.snackBar.open('Orden actualizada con éxito', 'Cerrar', { duration: 3000 });
          this.isSaving = false;
          this.router.navigate(['/ordenes-servicio']);
        },
        error: (err) => {
          this.isSaving = false;
          this.snackBar.open(err.error?.detail || err.error?.message || 'Error al actualizar', 'Cerrar', { duration: 5000 });
        }
      });
    } else {
      this.serviceOrderService.createServiceOrder(formValue).subscribe({
        next: () => {
          this.snackBar.open('Orden creada con éxito', 'Cerrar', { duration: 3000 });
          this.isSaving = false;
          this.router.navigate(['/ordenes-servicio']);
        },
        error: (err) => {
          this.isSaving = false;
          this.snackBar.open(err.error?.detail || err.error?.message || 'Error al crear', 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  onObservationAdded(payload: any): void {
    if (!this.orderId) return;
    this.serviceOrderService.addObservation(this.orderId, payload).subscribe({
      next: (obs) => {
        this.observations = [obs, ...this.observations];
        this.snackBar.open('Observación guardada', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error al guardar observación', 'Cerrar', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/ordenes-servicio']);
  }

  openCopyDetailsDialog(): void {
    const dialogRef = this.dialog.open(CopyOrderDetailsDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const currentValue = this.orderForm.get('budgetedTasksDetail')?.value || '';
        const newValue = currentValue ? `${currentValue}\n\n${result}` : result;
        this.orderForm.get('budgetedTasksDetail')?.setValue(newValue);
      }
    });
  }

  openCopyBillingDistributionDialog(): void {
    const dialogRef = this.dialog.open(CopyBillingDistributionDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && Array.isArray(result) && result.length > 0) {
        // Remove existing distributions
        while (this.distributions.length !== 0) {
          this.distributions.removeAt(0);
        }
        
        // Add new distributions based on result
        result.forEach(dist => {
          const group = this.fb.group({
            distributionConceptId: [dist.distributionConceptId, Validators.required],
            percentage: [dist.percentage, [Validators.required, Validators.min(0), Validators.max(100)]],
            expectedAmount: [{ value: 0, disabled: true }],
            actualAmount: [0]
          });
          
          group.get('percentage')?.valueChanges.subscribe(() => {
            const finalTotal = this.orderForm.get('totalAmount')?.value || 0;
            const budget = this.orderForm.get('budgetedAmount')?.value || 0;
            this.recalculateDistributions(finalTotal, budget);
          });
          
          this.distributions.push(group);
        });
        
        // Trigger calculation
        this.calculateTotal();
        this.snackBar.open('Distribución de cobro copiada con éxito', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openCopyOperativeActivitiesDialog(): void {
    const dialogRef = this.dialog.open(CopyOperativeActivitiesDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && Array.isArray(result) && result.length > 0) {
        // Remove existing activities
        while (this.activities.length !== 0) {
          this.activities.removeAt(0);
        }
        
        // Add new activities based on result
        result.forEach(act => {
          this.activities.push(this.fb.group({
            shortDetail: [act.shortDetail, Validators.required],
            longDetail: [act.longDetail || ''],
            status: ['Pendiente'],
            progressPercentage: [0, [Validators.min(0), Validators.max(100)]]
          }));
        });
        
        this.snackBar.open('Actividades copiadas con éxito', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // --- MÉTODOS DE COSTOS DIRECTOS ---

  loadDirectCosts(): void {
    if (!this.orderId) return;
    this.isLoadingCosts = true;
    this.directCostService.getCostsByOrder(this.orderId).subscribe({
      next: (costs) => {
        this.directCostsDataSource.data = costs;
        this.isLoadingCosts = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoadingCosts = false;
      }
    });
  }

  getTotalCosts(): number {
    return this.directCostsDataSource.data.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  }

  openDirectCostDialog(cost?: DirectCost): void {
    const dialogRef = this.dialog.open(DirectCostDialogComponent, {
      width: '600px',
      data: { cost, serviceOrderId: this.orderId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.id) {
          this.directCostService.updateCost(result.id, result).subscribe({
            next: () => {
              this.snackBar.open('Costo actualizado.', 'Cerrar', { duration: 3000 });
              this.loadDirectCosts();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open('Error al actualizar costo.', 'Cerrar', { duration: 4000 });
            }
          });
        } else {
          this.directCostService.createCost(result).subscribe({
            next: () => {
              this.snackBar.open('Costo registrado.', 'Cerrar', { duration: 3000 });
              this.loadDirectCosts();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open('Error al registrar costo.', 'Cerrar', { duration: 4000 });
            }
          });
        }
      }
    });
  }

  deleteDirectCost(costId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este costo directo?')) {
      if (!this.orderId) return;
      this.directCostService.deleteCost(this.orderId, costId).subscribe({
        next: () => {
          this.snackBar.open('Costo directo eliminado.', 'Cerrar', { duration: 3000 });
          this.loadDirectCosts();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al eliminar costo directo.', 'Cerrar', { duration: 4000 });
        }
      });
    }
  }
}
