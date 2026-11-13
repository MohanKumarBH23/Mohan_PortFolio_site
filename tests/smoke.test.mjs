import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PROFILE } from '../src/data/profile.js';
import { PUBLICATIONS } from '../src/data/publications.js';
import { PROJECTS } from '../src/data/projects.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

function walkFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

describe('Vite Bundle, Static Assets, Module Graph & CSP Smoke Verification', () => {
  it('ensures index.html complies with strict CSP (no inline executable scripts or handlers)', () => {
    const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
    assert.equal(/\son(click|submit|load|error)=/i.test(html), false);
    assert.equal(
      /<script(?![^>]*type="application\/ld\+json")(?![^>]*\bsrc=)/i.test(html),
      false
    );

    const localRefs = [
      ...html.matchAll(/(?:src|href)="(?!https?:|mailto:|tel:|data:|#)([^"]+)"/g)
    ].map((m) => m[1]);
    assert.ok(localRefs.length >= 3);
    for (const ref of localRefs) {
      const normalized = ref.startsWith('/') ? ref.slice(1) : ref;
      assert.equal(
        fs.existsSync(path.join(ROOT_DIR, normalized)),
        true,
        `Missing HTML referenced resource: ${ref}`
      );
    }
  });

  it('verifies all referenced assets, manifest icons, and styles exist on disk', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'site.webmanifest'), 'utf8'));
    const manifestIcons = (manifest.icons || []).map((icon) => icon.src);

    const assetPaths = [
      PROFILE.avatar.src,
      PROFILE.resume.url,
      'assets/plates/portrait-plate.png',
      ...PUBLICATIONS.map((p) => p.pdf.url),
      ...PROJECTS.flatMap((p) => [p.modal?.image, p.modal?.pdfUrl].filter(Boolean)),
      ...manifestIcons,
      'site.webmanifest',
      'robots.txt',
      'sitemap.xml',
      'src/styles/app.css'
    ];

    for (const relPath of assetPaths) {
      const fullPath = path.join(ROOT_DIR, relPath);
      assert.equal(fs.existsSync(fullPath), true, `Missing referenced asset: ${relPath}`);
    }
  });

  it('verifies all src/ JS modules import existing local files', () => {
    const jsFiles = walkFiles(path.join(ROOT_DIR, 'src')).filter((f) => f.endsWith('.js'));
    for (const file of jsFiles) {
      const code = fs.readFileSync(file, 'utf8');
      const importRe = /(?:import\s+(?:[^'"]+\s+from\s+)?|import\s*\(\s*)['"](\.[^'"]+)['"]/g;
      let match;
      while ((match = importRe.exec(code)) !== null) {
        const resolved = path.resolve(path.dirname(file), match[1]);
        assert.equal(
          fs.existsSync(resolved),
          true,
          `Broken relative import "${match[1]}" in ${path.relative(ROOT_DIR, file)}`
        );
      }
    }
  });

  it('verifies deployment configs are valid and target Vite dist output', () => {
    const vercel = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'vercel.json'), 'utf8'));
    assert.equal(vercel.framework, null);
    assert.equal(vercel.installCommand, 'npm install');
    assert.equal(vercel.buildCommand, 'npm run build');
    assert.equal(vercel.outputDirectory, 'dist');
    const sources = (vercel.headers || []).map((h) => h.source);
    assert.ok(sources.includes('/assets/(.*)'));
  });

  it('produces a clean Vite production bundle in dist/ including static assets', () => {
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'pipe' });
    const distDir = path.join(ROOT_DIR, 'dist');
    assert.equal(fs.existsSync(path.join(distDir, 'index.html')), true);
    assert.equal(fs.existsSync(path.join(distDir, 'assets/documents/Mohan_Resume.pdf')), true);
    assert.equal(fs.existsSync(path.join(distDir, 'assets/documents/intelli-eye-paper.pdf')), true);
    assert.equal(fs.existsSync(path.join(distDir, 'assets/plates/portrait-plate.png')), true);
    assert.equal(fs.existsSync(path.join(distDir, 'package.json')), false);
    assert.equal(fs.existsSync(path.join(distDir, 'tests')), false);
  });
});
