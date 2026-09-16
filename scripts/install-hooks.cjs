#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Configurando Git hooks...');

try {
  // Asegurar que el directorio de hooks exista
  const hooksDir = path.join(__dirname, '..', '.githooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  // Establecer core.hooksPath
  execSync('git config core.hooksPath .githooks');
  console.log('Git hooks configurados exitosamente a .githooks/');
} catch (error) {
  console.error('Error configurando Git hooks:', error.message);
  process.exit(1);
}
