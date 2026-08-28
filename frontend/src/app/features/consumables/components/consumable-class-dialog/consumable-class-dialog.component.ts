import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consumable-class-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './consumable-class-dialog.component.html',
  styleUrls: ['./consumable-class-dialog.component.css']
})
export class ConsumableClassDialogComponent implements OnInit {
  form: FormGroup;
  types: any[] = [];
  private apiUrl = `${environment.apiUrl}/consumable-classes`;

  constructor(
    private fb: FormBuilder, private http: HttpClient,
    public dialogRef: MatDialogRef<ConsumableClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({ 
      name: [data?.name || '', Validators.required],
      consumableTypeId: [data?.consumableTypeId || '', Validators.required]
    });
  }

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/consumable-types`).subscribe(res => {
      this.types = res;
      this.cdr.detectChanges();
    });
  }

  save() {
    if (this.form.invalid) return;
    const req = this.data 
      ? this.http.put(`${this.apiUrl}/${this.data.id}`, this.form.value)
      : this.http.post(this.apiUrl, this.form.value);
    req.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => { 
        this.snackBar.open(err.error?.message || 'Error al guardar', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
      }
    });
  }
}
