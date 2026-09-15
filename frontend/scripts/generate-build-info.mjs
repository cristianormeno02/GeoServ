// Genera src/assets/version.json y src/assets/changelog.json en cada build,
// para que el frontend pueda: (1) mostrarse a sí mismo en la página "Acerca de"
// y (2) detectar en runtime cuando el navegador tiene cacheada una versión vieja.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.join(__dirname, '..');
const repoRoot = path.join(frontendRoot, '..');
const assetsDir = path.join(frontendRoot, 'src', 'assets');

const pkg = JSON.parse(readFileSync(path.join(frontendRoot, 'package.json'), 'utf-8'));

function safeGitCommand(cmd) {
  try {
    return execSync(cmd, { cwd: repoRoot }).toString().trim();
  } catch {
    return null;
  }
}

const commit = safeGitCommand('git rev-parse --short HEAD') ?? 'unknown';

const versionInfo = {
  version: pkg.version,
  buildDate: new Date().toISOString(),
  commit
};

mkdirSync(assetsDir, { recursive: true });
writeFileSync(path.join(assetsDir, 'version.json'), JSON.stringify(versionInfo, null, 2));
console.log(`[build-info] version.json -> ${JSON.stringify(versionInfo)}`);

function extractRecentChangelog(maxEntries = 5) {
  const changelogPath = path.join(repoRoot, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) return [];

  const content = readFileSync(changelogPath, 'utf-8');
  const sections = content.split(/\n(?=## )/).filter(s => s.startsWith('## '));

  return sections.slice(0, maxEntries).map(section => {
    const lines = section.trim().split('\n');
    const header = lines[0].replace(/^##\s*/, '').trim();
    const body = lines.slice(1).join('\n').trim();
    return { header, body };
  });
}

const changelog = extractRecentChangelog();
writeFileSync(path.join(assetsDir, 'changelog.json'), JSON.stringify(changelog, null, 2));
console.log(`[build-info] changelog.json -> ${changelog.length} entrada(s)`);
