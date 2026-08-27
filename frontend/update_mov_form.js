const fs = require('fs');
const path = require('path');
let filePath = 'src/app/features/finance/movimientos/movimiento-form.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

if(!content.includes('MatSnackBar')) {
    content = content.replace(/import {([^}]+)} from '@angular\/core';/, "import { $1 } from '@angular/core';\nimport { MatSnackBar } from '@angular/material/snack-bar';");
    content = content.replace(/(constructor\s*\([\s\S]*?)(?=\s*\))/, "$1,\n    private snackBar: MatSnackBar");

    content = content.replace(/next: \(\) => this\.dialogRef\.close\(true\),[\s\S]*?error: \(err\) => {[\s\S]*?console\.error\(err\);[\s\S]*?this\.isSubmitting = false;[\s\S]*?}/g, (match) => {
        let isUpdate = content.indexOf(match) < content.lastIndexOf(match);
        let text = isUpdate ? 'Movimiento actualizado con éxito' : 'Movimiento creado con éxito';
        return `next: () => {
          this.snackBar.open('Movimiento guardado con éxito', 'Cerrar');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Error al guardar el movimiento', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] });
          this.isSubmitting = false;
        }`;
    });

    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
}
