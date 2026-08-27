import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ServiceOrderService } from '../../services/service-order.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-copy-order-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule
  ],
  templateUrl: './copy-order-details-dialog.component.html',
  styleUrls: ['./copy-order-details-dialog.component.scss']
})
export class CopyOrderDetailsDialogComponent implements OnInit {
  searchControl = new FormControl('');
  filteredOrders: any[] = [];
  selectedDetails: string = '';
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<CopyOrderDetailsDialogComponent>,
    private serviceOrderService: ServiceOrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
        this.cdr.detectChanges();
      }),
      switchMap(value => {
        if (typeof value === 'string' && value.length > 0) {
          return this.serviceOrderService.searchServiceOrders(value);
        }
        return of([]);
      })
    ).subscribe({
      next: (results) => {
        this.filteredOrders = results;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.filteredOrders = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  displayFn(order: any): string {
    return order ? `${order.orderNumber} - ${order.clientName || 'Sin Cliente'}` : '';
  }

  onOptionSelected(event: any): void {
    const order = event.option.value;
    this.selectedDetails = order?.budgetedTasksDetail || 'No hay detalle cargado en esta orden.';
    this.cdr.detectChanges();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.selectedDetails);
  }
}
