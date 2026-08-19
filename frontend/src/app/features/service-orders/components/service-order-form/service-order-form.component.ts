import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ServiceOrderService } from '../../services/service-order.service';
import { ClientService } from '../../../clients/services/client.service';
import { ServiceTypeService } from '../../../service-types/services/service-type.service';
import { UserService } from '../../../users/services/user.service';

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
    this.orderForm = this.fb.group({
      orderNumber: ['', Validators.required],
      clientId: ['', Validators.required],
      projectId: [''],
      serviceTypeId: ['', Validators.required],
      statusId: ['', Validators.required],
      priority: [2, Validators.required],
      description: [''],
      budgetedAmount: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      estimatedStartDate: [''],
      estimatedEndDate: [''],
      actualStartDate: [''],
      actualEndDate: [''],
      collectionDate: [''],
      distributions: this.fb.array([]),
      responsibles: this.fb.array([])
    });

    // Calcular Total Amount automáticamente
    this.orderForm.get('budgetedAmount')?.valueChanges.subscribe(val => this.calculateTotal());
    this.orderForm.get('discount')?.valueChanges.subscribe(val => this.calculateTotal());
  }

  calculateTotal() {
    const budget = this.orderForm.get('budgetedAmount')?.value || 0;
    const discount = this.orderForm.get('discount')?.value || 0;
    this.orderForm.get('totalAmount')?.setValue(budget - discount);
  }

  get distributions(): FormArray {
    return this.orderForm.get('distributions') as FormArray;
  }

  get responsibles(): FormArray {
    return this.orderForm.get('responsibles') as FormArray;
  }

  addDistribution() {
    this.distributions.push(this.fb.group({
      distributionConceptId: ['', Validators.required],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      expectedAmount: [0],
      actualAmount: [0]
    }));
  }

  removeDistribution(index: number) {
    this.distributions.removeAt(index);
  }

  addResponsible() {
    this.responsibles.push(this.fb.group({
      name: ['', Validators.required],
      position: [''],
      title: [''],
      specialties: [''],
      userId: ['']
    }));
  }

  removeResponsible(index: number) {
    this.responsibles.removeAt(index);
  }

  // Carga de catálogos
  loadCatalogs(): void {
    this.clientService.getClients().subscribe(res => this.clients = res);
    this.serviceTypeService.getServiceTypes().subscribe(res => this.serviceTypes = res);
    this.userService.getUsers().subscribe(res => this.users = res);
    
    this.serviceOrderService.getStatuses().subscribe(res => this.statuses = res);
    this.serviceOrderService.getProjects().subscribe(res => this.projects = res);
    this.serviceOrderService.getDistributionConcepts().subscribe(res => this.distributionConcepts = res);
  }

  loadOrderData(id: string): void {
    this.serviceOrderService.getServiceOrderById(id).subscribe({
      next: (order) => {
        this.orderForm.patchValue({
          orderNumber: order.orderNumber,
          clientId: order.clientId,
          projectId: order.projectId,
          serviceTypeId: order.serviceTypeId,
          statusId: order.statusId,
          priority: order.priorityValue,
          description: order.description,
          budgetedAmount: order.budgetedAmount,
          discount: order.discount,
          totalAmount: order.totalAmount,
          estimatedStartDate: order.estimatedStartDate,
          estimatedEndDate: order.estimatedEndDate,
          actualStartDate: order.actualStartDate,
          actualEndDate: order.actualEndDate,
          collectionDate: order.collectionDate
        });

        // Cargar distribuciones
        order.distributions.forEach(d => {
          this.distributions.push(this.fb.group({
            distributionConceptId: [d.distributionConceptId, Validators.required],
            percentage: [d.percentage, [Validators.required, Validators.min(0), Validators.max(100)]],
            expectedAmount: [d.expectedAmount],
            actualAmount: [d.actualAmount]
          }));
        });

        // Cargar responsables
        order.responsibles.forEach(r => {
          this.responsibles.push(this.fb.group({
            name: [r.name, Validators.required],
            position: [r.position],
            title: [r.title],
            specialties: [r.specialties],
            userId: [r.userId]
          }));
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
