import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseDotEnv, buildRuntimePayload } from '../scripts/generate-env.mjs';
import { createAppConfig, resolveEnvironmentName } from '../src/config/env.js';
import { ConfigError } from '../src/core/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaults = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../config/env.defaults.json'), 'utf8')
);

describe('Environment Configuration', () => {
  it('parses .env files ignoring comments and blank lines', () => {
    const parsed = parseDotEnv(`
      # Comment line
      APP_ENV="staging"
      API_TIMEOUT_MS='12000'
      EMPTY_VAL=
    `);
    assert.equal(parsed.APP_ENV, 'staging');
    assert.equal(parsed.API_TIMEOUT_MS, '12000');
    assert.equal(parsed.EMPTY_VAL, '');
  });

  it('merges defaults and env overrides via buildRuntimePayload', () => {
    const payload = buildRuntimePayload(defaults, {
      APP_ENV: 'production',
      API_TIMEOUT_MS: '5000',
      GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/demo/exec'
    });
    assert.equal(payload.appEnv, 'production');
    assert.equal(payload.api.timeoutMs, 5000);
    assert.equal(
      payload.api.endpoints.googleAppsScriptUrl,
      'https://script.google.com/macros/s/demo/exec'
    );
  });

  it('resolves environment names by hostname and explicit overrides', () => {
    assert.equal(resolveEnvironmentName(defaults, 'localhost'), 'development');
    assert.equal(resolveEnvironmentName(defaults, 'mohan.vercel.app'), 'staging');
    assert.equal(resolveEnvironmentName(defaults, 'mohankumarbh.dev'), 'production');
    assert.equal(resolveEnvironmentName({ ...defaults, appEnv: 'staging' }, 'localhost'), 'staging');
  });

  it('freezes the validated app config recursively', () => {
    const cfg = createAppConfig(buildRuntimePayload(defaults, {}), { hostname: 'mohankumarbh.dev' });
    assert.equal(cfg.env, 'production');
    assert.equal(Object.isFrozen(cfg), true);
    assert.equal(Object.isFrozen(cfg.api.endpoints), true);
  });

  it('throws ConfigError on invalid timeouts or insecure production URLs', () => {
    assert.throws(
      () => createAppConfig(buildRuntimePayload(defaults, { API_TIMEOUT_MS: '100' })),
      ConfigError
    );

    assert.throws(
      () =>
        createAppConfig(
          buildRuntimePayload(defaults, {
            APP_ENV: 'production',
            FORMSUBMIT_ENDPOINT: 'http://insecure.example.com/submit'
          })
        ),
      ConfigError
    );
  });
});

