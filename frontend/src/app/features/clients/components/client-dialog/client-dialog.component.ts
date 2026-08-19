import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { startWith, map, Observable } from 'rxjs';

import { ClientService } from '../../services/client.service';
import { Client, CompanyType, AvailableUser } from '../../models/client.model';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Modificar Cliente' : 'Nuevo Cliente' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="clientForm" class="client-form">
        
        <mat-form-field appearance="outline">
          <mat-label>Nombre de la Compañía</mat-label>
          <input matInput formControlName="companyName" required maxlength="150" #compName>
          <mat-hint align="end">{{compName.value.length}} / 150</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>ID Fiscal / RUT / CUIT</mat-label>
          <input matInput formControlName="taxId" required maxlength="20" #taxId>
          <mat-hint align="end">{{taxId.value.length}} / 20</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo de Compañía</mat-label>
          <mat-select formControlName="companyTypeId">
            <mat-option *ngFor="let type of companyTypes" [value]="type.id">
              {{ type.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email de Contacto</mat-label>
          <input matInput type="email" formControlName="contactEmail" maxlength="100" #email>
          <mat-hint align="end">{{email.value.length}} / 100</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Teléfono de Contacto</mat-label>
          <input matInput formControlName="contactPhone" maxlength="20" #phone>
          <mat-hint align="end">{{phone.value.length}} / 20</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Asignar Usuario (Portal Cliente)</mat-label>
          <input type="text"
                 placeholder="Buscar usuario..."
                 matInput
                 [formControl]="userSearchCtrl"
                 [matAutocomplete]="auto">
          <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayUserFn" (optionSelected)="onUserSelected($event)">
            <mat-option *ngFor="let user of filteredUsers$ | async" [value]="user">
              {{ user.name }} ({{ user.email }})
            </mat-option>
          </mat-autocomplete>
          <button *ngIf="userSearchCtrl.value" matSuffix mat-icon-button aria-label="Clear" (click)="clearUser($event)">
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="clientForm.invalid" (click)="save()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .client-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 10px;
      min-width: 400px;
    }
  `]
})
export class ClientDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  public dialogRef = inject(MatDialogRef<ClientDialogComponent>);
  
  clientForm: FormGroup;
  userSearchCtrl = new FormControl<string | AvailableUser | null>('');
  
  isEdit = false;
  companyTypes: CompanyType[] = [];
  
  availableUsers: AvailableUser[] = [];
  filteredUsers$!: Observable<AvailableUser[]>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { client?: Client }) {
    this.isEdit = !!data?.client;
    
    this.clientForm = this.fb.group({
      companyName: [data?.client?.companyName || '', Validators.required],
      taxId: [data?.client?.taxId || '', Validators.required],
      companyTypeId: [data?.client?.companyTypeId || null],
      contactEmail: [data?.client?.contactEmail || '', [Validators.email]],
      contactPhone: [data?.client?.contactPhone || ''],
      userId: [data?.client?.userId || null]
    });
  }

  ngOnInit(): void {
    this.loadCompanyTypes();
    this.loadAvailableUsers();

    this.filteredUsers$ = this.userSearchCtrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterUsers(name as string) : this.availableUsers.slice();
      })
    );
  }

  loadCompanyTypes() {
    this.clientService.getCompanyTypes().subscribe({
      next: (types) => {
        this.companyTypes = types;
      },
      error: (err) => {
        console.error('Error loading company types', err);
      }
    });
  }

  loadAvailableUsers() {
    this.clientService.getAvailableUsers(this.data?.client?.userId).subscribe(users => {
      this.availableUsers = users;
      // Trigger value changes to update the list
      this.userSearchCtrl.setValue(this.userSearchCtrl.value);
      
      if (this.isEdit && this.data?.client?.userId) {
        const found = users.find(u => u.id === this.data!.client!.userId);
        if (found) {
          this.userSearchCtrl.setValue(found);
        }
      }
    });
  }

  private _filterUsers(name: string): AvailableUser[] {
    const filterValue = name.toLowerCase();
    return this.availableUsers.filter(user => 
      user.name.toLowerCase().includes(filterValue) || 
      user.email.toLowerCase().includes(filterValue)
    );
  }

  displayUserFn(user: AvailableUser | null): string {
    return user && user.name ? `${user.name} (${user.email})` : '';
  }

  onUserSelected(event: MatAutocompleteSelectedEvent) {
    const user = event.option.value as AvailableUser;
    this.clientForm.patchValue({ userId: user.id });
  }

  clearUser(event: Event) {
    event.stopPropagation();
    this.userSearchCtrl.setValue('');
    this.clientForm.patchValue({ userId: null });
  }

  save() {
    if (this.clientForm.valid) {
      this.dialogRef.close(this.clientForm.value);
    }
  }
}
