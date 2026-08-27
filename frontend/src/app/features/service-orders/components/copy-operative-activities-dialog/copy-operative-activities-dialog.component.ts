import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { ServiceOrderService } from '../../services/service-order.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-copy-operative-activities-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatListModule
  ],
  templateUrl: './copy-operative-activities-dialog.component.html',
  styleUrls: ['./copy-operative-activities-dialog.component.scss']
})
export class CopyOperativeActivitiesDialogComponent implements OnInit {
  searchControl = new FormControl('');
  filteredOrders: any[] = [];
  selectedActivities: any[] = [];
  isLoading = false;
  selectedOrderNumber: string = '';

  constructor(
    public dialogRef: MatDialogRef<CopyOperativeActivitiesDialogComponent>,
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
    if (order.id) {
      this.serviceOrderService.getServiceOrderById(order.id).subscribe(fullOrder => {
        this.selectedActivities = fullOrder.activities || [];
        this.selectedOrderNumber = fullOrder.orderNumber;
        this.cdr.detectChanges();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.selectedActivities);
  }
}
