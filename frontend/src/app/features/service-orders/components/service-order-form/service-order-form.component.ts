import { Component, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

// ngx-mask
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NumericInputDirective } from '../../../shared/directives/numeric-input.directive';

import { ServiceOrderService } from '../../services/service-order.service';
import { EmpresaConfigService } from '../../../empresa-config/empresa-config.service';
import { ClientService } from '../../../clients/services/client.service';
import { ServiceTypeService } from '../../../service-types/services/service-type.service';
import { UserService } from '../../../users/services/user.service';
import { ServiceOrderObservationsComponent } from '../service-order-observations/service-order-observations.component';
import { CopyOrderDetailsDialogComponent } from '../copy-order-details-dialog/copy-order-details-dialog.component';
import { CopyBillingDistributionDialogComponent } from '../copy-billing-distribution-dialog/copy-billing-distribution-dialog.component';
import { CopyOperativeActivitiesDialogComponent } from '../copy-operative-activities-dialog/copy-operative-activities-dialog.component';
import { CopyDirectCostsDialogComponent } from '../copy-direct-costs-dialog/copy-direct-costs-dialog.component';

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
    MatTabsModule,
    MatChipsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    NgxMaskDirective,
    NumericInputDirective,
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

  get selectedClientName(): string {
    const clientId = this.orderForm?.get('clientId')?.value;
    if (!clientId) return '';
    const client = this.clients.find(c => c.id === clientId);
    return client ? client.companyName : '';
  }

  get selectedProjectName(): string {
    const projectId = this.orderForm?.get('projectId')?.value;
    if (!projectId) return '';
    const project = this.projects.find(p => p.id === projectId);
    return project ? project.name : '';
  }

  // Catálogos para Costos Directos
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
    private directCostService: DirectCostService,
    private empresaConfigService: EmpresaConfigService,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCatalogs();
    
    this.empresaConfigService.getSettings().subscribe({
      next: (settings: any) => {
        if (settings['os_number_format'] && settings['os_number_format'].value === 'auto') {
          if (!this.isEditMode) {
            this.orderForm.get('orderNumber')?.disable();
            this.orderForm.get('orderNumber')?.clearValidators();
            this.orderForm.get('orderNumber')?.setValue('Auto-generado');
            this.orderForm.get('orderNumber')?.updateValueAndValidity();
          } else {
            this.orderForm.get('orderNumber')?.disable();
          }
        }
      }
    });
    
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

  moveDistribution(index: number, direction: number) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < this.distributions.length) {
      const current = this.distributions.at(index);
      this.distributions.removeAt(index);
      this.distributions.insert(newIndex, current);
      this.orderForm.markAsDirty();
    }
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

  createActivityGroup(initialData?: any): FormGroup {
    const group = this.fb.group({
      shortDetail: [initialData?.shortDetail || '', Validators.required],
      longDetail: [initialData?.longDetail || ''],
      status: [initialData?.status || 'Pendiente'],
      progressPercentage: [{ value: initialData?.progressPercentage || 0, disabled: true }, [Validators.min(0), Validators.max(100)]]
    });

    group.get('status')?.valueChanges.subscribe(status => {
      const progressCtrl = group.get('progressPercentage');
      if (status === 'Pendiente' || status === 'Cancelado') {
        progressCtrl?.setValue(0, { emitEvent: false });
        progressCtrl?.disable({ emitEvent: false });
      } else if (status === 'Finalizado') {
        progressCtrl?.setValue(100, { emitEvent: false });
        progressCtrl?.disable({ emitEvent: false });
      } else if (status === 'En Proceso') {
        progressCtrl?.enable({ emitEvent: false });
        // Optional: clear validators and add new ones for 0-99? Or handle in onSubmit
      }
    });

    // Initialize state properly
    const status = group.get('status')?.value;
    const progressCtrl = group.get('progressPercentage');
    if (status === 'Pendiente' || status === 'Cancelado') {
      progressCtrl?.disable({ emitEvent: false });
      progressCtrl?.setValue(0, { emitEvent: false });
    } else if (status === 'Finalizado') {
      progressCtrl?.disable({ emitEvent: false });
      progressCtrl?.setValue(100, { emitEvent: false });
    } else if (status === 'En Proceso') {
      progressCtrl?.enable({ emitEvent: false });
    }

    return group;
  }

  addActivity() {
    this.activities.push(this.createActivityGroup());
  }

  removeActivity(index: number) {
    this.activities.removeAt(index);
  }

  moveActivity(index: number, direction: number) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < this.activities.length) {
      const current = this.activities.at(index);
      this.activities.removeAt(index);
      this.activities.insert(newIndex, current);
      this.orderForm.markAsDirty();
    }
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
          this.activities.push(this.createActivityGroup({
            shortDetail: a.shortDetail,
            longDetail: a.longDetail,
            status: a.state,
            progressPercentage: a.progressPercentage
          }));
        });

        // Cargar observaciones
        this.observations = order.observations ?? [];
      },
      error: () => this.snackBar.open('Error al cargar la orden', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] })
    });
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.snackBar.open('Por favor, revise los campos del formulario.', 'Cerrar', { duration: 3000, panelClass: ['snackbar-warning'] });
      return;
    }

    const formValue = { ...this.orderForm.getRawValue() };
    if (formValue.projectId === '') {
      formValue.projectId = null;
    }

    // Validación de Actividades Operativas
    if (formValue.activities && formValue.activities.length > 0) {
      const statusId = formValue.statusId;
      const selectedStatus = this.statuses.find(s => s.id === statusId);
      const isEntregada = selectedStatus && selectedStatus.name.toLowerCase() === 'entregada';

      for (const a of formValue.activities) {
        const prog = Number(a.progressPercentage) || 0;
        if ((a.status === 'Pendiente' || a.status === 'Cancelado') && prog !== 0) {
          this.snackBar.open(`La actividad "${a.shortDetail}" está en ${a.status} y su progreso debe ser 0%.`, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
          return;
        }
        if (a.status === 'Finalizado' && prog !== 100) {
          this.snackBar.open(`La actividad "${a.shortDetail}" está Finalizada y su progreso debe ser 100%.`, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
          return;
        }
        if (a.status === 'En Proceso' && (prog < 0 || prog > 99)) {
          this.snackBar.open(`La actividad "${a.shortDetail}" está En Proceso y su progreso debe estar entre 0% y 99%.`, 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
          return;
        }
        if (isEntregada && (a.status !== 'Finalizado' && a.status !== 'Cancelado')) {
          this.snackBar.open('Para guardar la orden en estado Entregada, todas las actividades operativas deben estar Finalizadas o Canceladas.', 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
          return;
        }
      }
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
        this.snackBar.open('La suma de los porcentajes de distribución debe ser exactamente 100.', 'Cerrar', { duration: 4000, panelClass: ['snackbar-warning'] });
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
          this.snackBar.open(err.error?.detail || err.error?.message || 'Error al actualizar', 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
        }
      });
    } else {
      // Agregar colecciones locales
      if (this.observations.length > 0) {
         formValue.observations = this.observations.map(o => ({
            text: o.text,
            observationType: o.observationType
         }));
      }
      if (this.directCostsDataSource.data.length > 0) {
         formValue.directCosts = this.directCostsDataSource.data.map(c => {
            const { id, ...rest } = c as any;
            return rest;
         });
      }

      this.serviceOrderService.createServiceOrder(formValue).subscribe({
        next: () => {
          this.snackBar.open('Orden creada con éxito', 'Cerrar', { duration: 3000 });
          this.isSaving = false;
          this.router.navigate(['/ordenes-servicio']);
        },
        error: (err) => {
          this.isSaving = false;
          this.snackBar.open(err.error?.detail || err.error?.message || 'Error al crear', 'Cerrar', { duration: 5000, panelClass: ['snackbar-error'] });
        }
      });
    }
  }

  onObservationAdded(payload: any): void {
    if (!this.isEditMode) {
      // Almacenar localmente si estamos en creación
      const tempObs = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
        text: payload.text,
        observationType: payload.observationType,
        createdAt: new Date().toISOString()
      };
      this.observations = [tempObs, ...this.observations];
      this.snackBar.open('Observación registrada', 'Cerrar', { duration: 2000 });
      return;
    }
    if (!this.orderId) return;
    this.serviceOrderService.addObservation(this.orderId, payload).subscribe({
      next: (obs) => {
        this.observations = [obs, ...this.observations];
        this.snackBar.open('Observación guardada', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error al guardar observación', 'Cerrar', { duration: 3000, panelClass: ['snackbar-error'] });
      }
    });
  }

  goBack(): void {
    if (this.orderForm.dirty) {
      if (!window.confirm('Hay modificaciones sin guardar. ¿Desea salir sin guardar los datos?')) {
        return;
      }
    }
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
        this.cdr.detectChanges();
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
          this.activities.push(this.createActivityGroup({
            shortDetail: act.shortDetail,
            longDetail: act.longDetail,
            status: 'Pendiente',
            progressPercentage: 0
          }));
        });
        
        this.cdr.detectChanges();
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

  openCopyDirectCostsDialog(): void {
    const dialogRef = this.dialog.open(CopyDirectCostsDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: any[]) => {
      if (result && Array.isArray(result) && result.length > 0) {
        // Copiar y generar nuevos UUIDs si es necesario, preservando orden.
        const copiedCosts = result.map(cost => {
          return {
             ...cost,
             id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
             serviceOrderId: this.orderId || null
          };
        });
        
        this.directCostsDataSource.data = [...this.directCostsDataSource.data, ...copiedCosts];
        this.orderForm.markAsDirty();
        this.snackBar.open('Costos directos copiados con éxito', 'Cerrar', { duration: 3000 });
        
        // Si estamos editando y el form ya se guardó, quizás deberíamos guardarlos 
        // pero la instrucción dice de 'Copiar desde otra orden' con inserción. 
        // Al copiarlos los guardamos localmente. El save total debería guardarlos o podemos subirlos.
        // Dado que directCost tiene endpoint propio, quizas debamos postear.
        if (this.isEditMode && this.orderId) {
           copiedCosts.forEach(cc => {
               this.directCostService.createCost(cc).subscribe({
                  next: () => this.loadDirectCosts(),
                  error: err => console.error(err)
               });
           });
        }
      }
    });
  }

  openDirectCostDialog(cost?: DirectCost): void {
    const dialogRef = this.dialog.open(DirectCostDialogComponent, {
      width: '600px',
      data: { cost, serviceOrderId: this.orderId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (!this.isEditMode) {
          if (result.id) {
             const idx = this.directCostsDataSource.data.findIndex(c => c.id === result.id);
             if (idx >= 0) {
                 this.directCostsDataSource.data[idx] = result;
                 this.directCostsDataSource.data = [...this.directCostsDataSource.data];
             }
          } else {
             result.id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString();
             this.directCostsDataSource.data = [...this.directCostsDataSource.data, result];
          }
          this.snackBar.open('Costo registrado localmente.', 'Cerrar', { duration: 3000 });
          return;
        }

        if (result.id) {
          this.directCostService.updateCost(result.id, result).subscribe({
            next: () => {
              this.snackBar.open('Costo actualizado.', 'Cerrar', { duration: 3000 });
              this.loadDirectCosts();
            },
            error: (err) => {
              console.error(err);
              this.snackBar.open('Error al actualizar costo.', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
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
              this.snackBar.open('Error al registrar costo.', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
            }
          });
        }
      }
    });
  }

  deleteDirectCost(costId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este costo directo?')) {
      if (!this.isEditMode) {
          this.directCostsDataSource.data = this.directCostsDataSource.data.filter(c => c.id !== costId);
          this.orderForm.markAsDirty();
          this.snackBar.open('Costo directo eliminado localmente.', 'Cerrar', { duration: 3000 });
          return;
      }
      if (!this.orderId) return;
      this.directCostService.deleteCost(this.orderId, costId).subscribe({
        next: () => {
          this.snackBar.open('Costo directo eliminado.', 'Cerrar', { duration: 3000 });
          this.loadDirectCosts();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Error al eliminar costo directo.', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
        }
      });
    }
  }

  moveDirectCost(index: number, direction: number) {
    const newIndex = index + direction;
    const data = this.directCostsDataSource.data;
    if (newIndex >= 0 && newIndex < data.length) {
      const temp = data[index];
      data[index] = data[newIndex];
      data[newIndex] = temp;
      this.directCostsDataSource.data = [...data];
      this.orderForm.markAsDirty();
    }
  }
}
