import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consumable-type-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './consumable-type-dialog.component.html',
  styleUrls: ['./consumable-type-dialog.component.css']
})
export class ConsumableTypeDialogComponent {
  form: FormGroup;
  private apiUrl = `${environment.apiUrl}/consumable-types`;

  constructor(
    private fb: FormBuilder, private http: HttpClient,
    public dialogRef: MatDialogRef<ConsumableTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({ name: [data?.name || '', Validators.required] });
  }

  save() {
    if (this.form.invalid) return;
    const req = this.data 
      ? this.http.put(`${this.apiUrl}/${this.data.id}`, this.form.value)
      : this.http.post(this.apiUrl, this.form.value);
    req.subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => { 
        this.snackBar.open(err.error?.message || 'Error al guardar', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
