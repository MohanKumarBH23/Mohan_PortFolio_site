/**
 * @fileoverview Zero-dependency static distribution builder for Vercel / CDN hosts.
 * Regenerates `src/config/runtimeEnv.js` and stages only public web runtime
 * files into `dist/`, preventing non-web repo files (`tests/`, `scripts/`,
 * `docs/`, `api/`, `.agents/`) from being published to the static CDN.
 *
 * Usage:
 *   node scripts/build-dist.mjs
 *   npm run build
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateRuntimeEnv } from './generate-env.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export const DEFAULT_OUT_DIR = path.join(ROOT_DIR, 'dist');
export const PUBLIC_ENTRIES = Object.freeze([
  'index.html',
  'site.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'src',
  'assets'
]);

/**
 * Builds the static distribution directory containing only deployable web assets.
 *
 * @param {object} [options]
 * @param {string} [options.outDir] - Target distribution directory.
 * @returns {string} Resolved output directory path.
 */
export function buildDist({ outDir = DEFAULT_OUT_DIR } = {}) {
  const targetDir = path.resolve(outDir);
  if (targetDir === ROOT_DIR) {
    throw new Error('Refusing to use repository root as build output directory.');
  }

  generateRuntimeEnv();

  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of PUBLIC_ENTRIES) {
    const srcPath = path.join(ROOT_DIR, entry);
    if (!fs.existsSync(srcPath)) {
      throw new Error(`Missing required public entry for dist build: ${entry}`);
    }

    const destPath = path.join(targetDir, entry);
    fs.cpSync(srcPath, destPath, { recursive: true });
  }

  console.log(`Built static distribution in ${path.relative(ROOT_DIR, targetDir) || targetDir}.`);
  return targetDir;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  buildDist();
}

