const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if(!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Only modify if it doesn't already have MatSnackBar
    if(!content.includes('MatSnackBar')) {
        content = content.replace(/import {([^}]+)} from '@angular\/core';/, "import { $1 } from '@angular/core';\nimport { MatSnackBar } from '@angular/material/snack-bar';");
        
        // Inject into constructor if present
        content = content.replace(/(constructor\s*\([\s\S]*?)(?=\s*\))/, "$1,\n    private snackBar: MatSnackBar");
    }

    // Replace basic subscribe blocks for deletions
    content = content.replace(/delete[A-Za-z]+\(.*?\)[\s\S]*?subscribe\({[\s\S]*?next: \(\) => (?:this\.)?load[A-Za-z]+\(\),[\s\S]*?error: \(err\) => console.error\(err\)[\s\S]*?}\)/g, (match) => {
        let replacement = match.replace(/next: \(\) => (this\.load[A-Za-z]+\(\)),/, "next: () => { this.snackBar.open('Eliminado con éxito', 'Cerrar'); $1; },");
        replacement = replacement.replace(/error: \(err\) => console\.error\(err\)/, "error: (err) => { console.error(err); this.snackBar.open(err.error?.message || 'Error al eliminar', 'Cerrar', { duration: 4000, panelClass: ['snackbar-error'] }); }");
        return replacement;
    });

    if(content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + filePath);
    }
}

replaceInFile('src/app/features/finance/categorias-movimiento/categorias-movimiento.ts');
replaceInFile('src/app/features/finance/movimientos/movimientos.ts');
