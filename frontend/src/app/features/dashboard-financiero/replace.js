const fs = require('fs');
const file = 'e:/Proyectos Propios/GeoServ/frontend/src/app/features/dashboard-financiero/financial-dashboard.component.html';
let html = fs.readFileSync(file, 'utf8');
html = html.replace(/<app-report-info-button \[infoText\]="(infoTexts\.[a-zA-Z]+)"><\/app-report-info-button>/g, '<button mat-icon-button class="widget-help-btn" [matTooltip]="$1" matTooltipPosition="above" matTooltipClass="custom-help-tooltip"><mat-icon>help_outline</mat-icon></button>');

// Add tooltips to KPIs as well:
html = html.replace(/semanticState="neutral"\n    ><\/app-sparkline-card>/g, 'semanticState="neutral"\n      [helpText]="infoTexts.saldoCuentas"\n    ></app-sparkline-card>');
html = html.replace(/semanticState="positive"\n    ><\/app-sparkline-card>/g, 'semanticState="positive"\n      [helpText]="infoTexts.ingresosMes"\n    ></app-sparkline-card>');
html = html.replace(/\[semanticState\]="\(kpis\?\.monthlyNetResult\?\.value \?\? 0\) >= 0 \? 'positive' : 'negative'"\n    ><\/app-sparkline-card>/g, '[semanticState]="(kpis?.monthlyNetResult?.value ?? 0) >= 0 ? \'positive\' : \'negative\'"\n      [helpText]="infoTexts.resultadoMes"\n    ></app-sparkline-card>');
html = html.replace(/\[semanticState\]="\(kpis\?\.accumulatedCoverage\?\.semanticStatus === 'Positive'\) \? 'positive' : 'negative'"\n    ><\/app-sparkline-card>/g, '[semanticState]="(kpis?.accumulatedCoverage?.semanticStatus === \'Positive\') ? \'positive\' : \'negative\'"\n      [helpText]="infoTexts.saldoAcumulado"\n    ></app-sparkline-card>');

fs.writeFileSync(file, html);
