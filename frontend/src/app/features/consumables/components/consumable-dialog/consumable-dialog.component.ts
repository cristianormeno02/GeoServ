import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ConsumableService } from '../../services/consumable.service';
import { ConsumableType, ConsumableClass } from '../../models/consumable.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-consumable-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './consumable-dialog.component.html',
  styleUrls: ['./consumable-dialog.component.css']
})
export class ConsumableDialogComponent implements OnInit {
  form: FormGroup;
  types: ConsumableType[] = [];
  allClasses: ConsumableClass[] = [];
  filteredClasses: ConsumableClass[] = [];
  providers: any[] = [];
  units: any[] = [];

  constructor(
    private fb: FormBuilder,
    private consumableService: ConsumableService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ConsumableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      purchaseDate: [new Date(), Validators.required],
      typeId: [null, Validators.required],
      consumableClassId: [null, Validators.required],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      unitId: ['', Validators.required],
      unitCost: [0, [Validators.required, Validators.min(0)]],
      totalCost: [0, [Validators.required, Validators.min(0)]],
      providerId: [null],
      observation: ['']
    });

    this.form.get('typeId')?.valueChanges.subscribe(typeId => {
      this.filteredClasses = this.allClasses.filter(c => c.consumableTypeId === typeId);
      if (!this.data) this.form.get('consumableClassId')?.setValue(null);
    });

    this.form.get('quantity')?.valueChanges.subscribe(() => this.calculateTotal());
    this.form.get('unitCost')?.valueChanges.subscribe(() => this.calculateTotal());

    if (data) {
      setTimeout(() => {
        this.form.patchValue({
          ...data,
          typeId: data.consumableClass?.consumableTypeId,
          purchaseDate: new Date(data.purchaseDate)
        });
      });
    }
  }

  ngOnInit(): void {
    this.consumableService.getConsumableTypes().subscribe(res => this.types = res);
    this.consumableService.getConsumableClasses().subscribe(res => {
      this.allClasses = res;
      if (this.data && this.data.consumableClass) {
        this.filteredClasses = res.filter(c => c.consumableTypeId === this.data.consumableClass.consumableTypeId);
      }
    });
    this.http.get<any[]>(`${environment.apiUrl}/api/providers`).subscribe(res => this.providers = res);
    this.http.get<any[]>(`${environment.apiUrl}/api/units`).subscribe(res => this.units = res);
  }

  calculateTotal() {
    const qty = this.form.get('quantity')?.value || 0;
    const cost = this.form.get('unitCost')?.value || 0;
    this.form.get('totalCost')?.setValue(qty * cost, { emitEvent: false });
  }

  save() {
    if (this.form.invalid) return;
    const req = this.data 
      ? this.consumableService.updateConsumable(this.data.id, this.form.value)
      : this.consumableService.createConsumable(this.form.value);

    req.subscribe(() => this.dialogRef.close(true));
  }
}
