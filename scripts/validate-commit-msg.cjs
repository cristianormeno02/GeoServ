const fs = require('fs');

const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  console.error("No se proporcionó el archivo del mensaje de commit.");
  process.exit(1);
}

const msg = fs.readFileSync(commitMsgFile, 'utf8').trim();

// Ignorar mensajes automáticos de Git
if (msg.startsWith('Merge ') || msg.startsWith('Revert ') || msg.startsWith('Merge branch') || msg.startsWith('Merge pull request')) {
  process.exit(0);
}

// Regex validando: tipo(opcional_alcance)!: descripcion
// Tipos extraidos de .versionrc.json
const commitRegex = /^(feat|fix|refactor|perf|docs|style|test|build|ci|chore)(\([^)]+\))?\!?:\s.+$/;

if (!commitRegex.test(msg)) {
  console.error('\n\x1b[31mError: Mensaje de commit inválido.\x1b[0m');
  console.error('\nEl mensaje no sigue el estándar de Conventional Commits requerido por el versionado automático.');
  console.error('Mensaje actual:');
  console.error(`  ${msg}`);
  console.error('\nFormato esperado:');
  console.error('  <tipo>(<alcance opcional>): <descripción>');
  console.error('\nTipos permitidos:');
  console.error('  feat, fix, refactor, perf, docs, style, test, build, ci, chore');
  console.error('\nEjemplos válidos:');
  console.error('  feat(ordenes-servicio): agregar exportación a excel');
  console.error('  fix(auth): corregir refresco de token');
  console.error('  refactor: limpiar logs del sistema');
  console.error('\nPor favor, corrige el mensaje de commit e inténtalo de nuevo.\n');
  process.exit(1);
}

process.exit(0);
