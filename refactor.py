import re

with open(r'frontend/src/app/features/service-orders/components/service-order-form/service-order-form.component.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<mat-expansion-panel>\s*<mat-expansion-panel-header>\s*<mat-panel-title>Fechas</mat-panel-title>\s*<mat-panel-description>(.*?)</mat-panel-description>\s*</mat-expansion-panel-header>', r'', content, flags=re.DOTALL)

content = re.sub(r'</mat-expansion-panel>\s*<!-- Finanzas -->\s*<mat-expansion-panel>\s*<mat-expansion-panel-header>\s*<mat-panel-title>Finanzas</mat-panel-title>\s*<mat-panel-description>(.*?)</mat-panel-description>\s*</mat-expansion-panel-header>', r'</div>\n          </mat-tab>\n\n          <!-- Finanzas -->\n          <mat-tab>\n            <ng-template mat-tab-label>\n              Finanzas\n              \1\n            </ng-template>\n            <div style="padding-top: 16px;">', content, flags=re.DOTALL)

content = re.sub(r'</mat-expansion-panel>\s*<!-- Actividades Operativas -->\s*<mat-expansion-panel>\s*<mat-expansion-panel-header>\s*<mat-panel-title>Actividades Operativas</mat-panel-title>.*?</mat-expansion-panel-header>', r'</div>\n          </mat-tab>\n\n          <!-- Actividades Operativas -->\n          <mat-tab label="Actividades Operativas">\n            <div style="padding-top: 16px;">', content, flags=re.DOTALL)

content = re.sub(r'</mat-expansion-panel>\s*<!-- Equipo de Trabajo \(Responsables\) -->\s*<mat-expansion-panel>\s*<mat-expansion-panel-header>\s*<mat-panel-title>Equipo de Trabajo \(Responsables\)</mat-panel-title>\s*<mat-panel-description>(.*?)</mat-panel-description>\s*</mat-expansion-panel-header>', r'</div>\n          </mat-tab>\n\n          <!-- Equipo de Trabajo (Responsables) -->\n          <mat-tab>\n            <ng-template mat-tab-label>\n              Equipo de Trabajo\n              \1\n            </ng-template>\n            <div style="padding-top: 16px;">', content, flags=re.DOTALL)

content = re.sub(r'</mat-expansion-panel>\s*<!-- Costos Directos -->\s*<mat-expansion-panel \*ngIf="isEditMode">\s*<mat-expansion-panel-header>\s*<mat-panel-title>Costos Directos</mat-panel-title>\s*</mat-expansion-panel-header>', r'</div>\n          </mat-tab>\n\n          <!-- Costos Directos -->\n          <mat-tab label="Costos Directos" *ngIf="isEditMode">\n            <div style="padding-top: 16px;">', content, flags=re.DOTALL)

content = re.sub(r'</mat-expansion-panel>\s*<!-- Bitácora y Observaciones -->\s*<mat-expansion-panel \*ngIf="isEditMode">\s*<mat-expansion-panel-header>\s*<mat-panel-title>Bitácora y Observaciones</mat-panel-title>\s*</mat-expansion-panel-header>', r'</div>\n          </mat-tab>\n\n          <!-- Bitácora y Observaciones -->\n          <mat-tab label="Bitácora y Observaciones" *ngIf="isEditMode">\n            <div style="padding-top: 16px;">', content, flags=re.DOTALL)

content = re.sub(r'</mat-expansion-panel>\s*</mat-accordion>', r'</div>\n          </mat-tab>\n\n        </mat-tab-group>', content, flags=re.DOTALL)

with open(r'frontend/src/app/features/service-orders/components/service-order-form/service-order-form.component.html', 'w', encoding='utf-8') as f:
    f.write(content)
