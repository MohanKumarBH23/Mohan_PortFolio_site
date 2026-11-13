import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const ROOT_STATIC_FILES = ['robots.txt', 'sitemap.xml', 'site.webmanifest', '_headers'];

fs.mkdirSync(DIST_DIR, { recursive: true });

// Copy static assets directory (documents, images, plates) into dist/assets
const srcAssets = path.join(ROOT_DIR, 'assets');
const destAssets = path.join(DIST_DIR, 'assets');
if (fs.existsSync(srcAssets)) {
  fs.cpSync(srcAssets, destAssets, { recursive: true, force: true });
}

for (const file of ROOT_STATIC_FILES) {
  const srcPath = path.join(ROOT_DIR, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(DIST_DIR, file));
  }
}

console.log('Static assets and metadata copied to dist/.');

