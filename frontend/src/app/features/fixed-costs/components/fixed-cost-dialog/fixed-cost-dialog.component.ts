import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FixedCostService } from '../../services/fixed-cost.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-fixed-cost-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './fixed-cost-dialog.component.html',
  styleUrls: ['./fixed-cost-dialog.component.css']
})
export class FixedCostDialogComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];
  providers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private fixedCostService: FixedCostService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<FixedCostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      providerId: [null],
      initialAmount: [0, [Validators.required, Validators.min(0)]],
      isRecurring: [false],
      observation: ['']
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/api/fixed-cost-categories`).subscribe(res => this.categories = res);
    this.http.get<any[]>(`${environment.apiUrl}/api/providers`).subscribe(res => this.providers = res);
  }

  save() {
    if (this.form.invalid) return;
    const req = this.data 
      ? this.fixedCostService.updateItem(this.data.id, this.form.value)
      : this.fixedCostService.createItem(this.form.value);

    req.subscribe(() => this.dialogRef.close(true));
  }
}
