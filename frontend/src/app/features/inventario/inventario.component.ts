import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ConsumableService } from '../consumables/services/consumable.service';
import { Consumable, ConsumableClass } from '../consumables/models/consumable.model';
import { InventoryHistoryDialogComponent } from '../consumables/components/inventory-history-dialog/inventory-history-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatChipsModule,
    ReactiveFormsModule, MatDialogModule
  ],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  dataSource = new MatTableDataSource<Consumable>();
  
  // KPIs
  totalValue = 0;
  criticalItemsCount = 0;
  outOfStockCount = 0;
  totalActiveItems = 0;

  // Filters
  searchControl = new FormControl('');
  classControl = new FormControl('all');
  statusControl = new FormControl('all');
  
  consumableClasses: ConsumableClass[] = [];

  displayedColumns = [
    'description', 'className', 'currentStock', 'minimumStock', 
    'unitName', 'unitCost', 'totalValue', 'status', 'actions'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private consumableService: ConsumableService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
    
    // Setup filter subscriptions
    this.searchControl.valueChanges.subscribe(() => this.applyFilter());
    this.classControl.valueChanges.subscribe(() => this.applyFilter());
    this.statusControl.valueChanges.subscribe(() => this.applyFilter());

    // Custom filter predicate
    this.dataSource.filterPredicate = (data: Consumable, filter: string) => {
      const searchStr = this.searchControl.value?.toLowerCase() || '';
      const classId = this.classControl.value;
      const status = this.statusControl.value;
      
      const matchSearch = data.description.toLowerCase().includes(searchStr);
      const matchClass = classId === 'all' || data.consumableClassId === classId;
      
      let matchStatus = true;
      if (status === 'critical') {
        matchStatus = data.quantity > 0 && data.quantity <= data.minimumStock;
      } else if (status === 'out_of_stock') {
        matchStatus = data.quantity === 0;
      } else if (status === 'normal') {
        matchStatus = data.quantity > data.minimumStock;
      }

      return matchSearch && matchClass && matchStatus;
    };
  }

  loadData() {
    this.consumableService.getConsumables().subscribe(data => {
      this.dataSource.data = data;
      // Setup paginator & sort after data load to ensure bindings
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
      
      // Extract unique classes for the filter
      const classesMap = new Map<string, ConsumableClass>();
      data.forEach(c => {
        if (c.consumableClass && !classesMap.has(c.consumableClassId)) {
          classesMap.set(c.consumableClassId, c.consumableClass);
        }
      });
      this.consumableClasses = Array.from(classesMap.values());

      this.calculateKPIs(data);
    });
  }

  applyFilter() {
    // Trigger the filter predicate
    this.dataSource.filter = Math.random().toString();
    this.calculateKPIs(this.dataSource.filteredData);
  }

  calculateKPIs(data: Consumable[]) {
    this.totalActiveItems = data.length;
    this.totalValue = data.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
    this.outOfStockCount = data.filter(item => item.quantity === 0).length;
    this.criticalItemsCount = data.filter(item => item.quantity > 0 && item.quantity <= item.minimumStock).length;
    
    // Logging for Task 2.1 verification
    console.log('--- KPIs Calculados ---');
    console.log('Valor Total:', this.totalValue);
    console.log('Insumos Activos:', this.totalActiveItems);
    console.log('Agotados:', this.outOfStockCount);
    console.log('Críticos:', this.criticalItemsCount);
  }

  openHistory(element: Consumable) {
    this.dialog.open(InventoryHistoryDialogComponent, {
      width: '600px',
      data: { consumableId: element.id }
    });
  }

  exportToCSV() {
    const data = this.dataSource.filteredData;
    const csvRows = [];
    
    // Header
    csvRows.push(['Insumo', 'Clase', 'Stock Actual', 'Stock Minimo', 'Unidad', 'Costo Unitario', 'Valorizacion Total', 'Estado'].join(','));
    
    data.forEach(item => {
      const estado = item.quantity === 0 ? 'Agotado' : (item.quantity <= item.minimumStock ? 'Critico' : 'Normal');
      const row = [
        `"${item.description}"`,
        `"${item.consumableClass?.name || ''}"`,
        item.quantity,
        item.minimumStock,
        `"${item.unit?.name || ''}"`,
        item.unitCost,
        (item.quantity * item.unitCost).toFixed(2),
        `"${estado}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventario_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
