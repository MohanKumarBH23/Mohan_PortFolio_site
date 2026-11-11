import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { ApiClient } from '../src/api/client.js';
import { createEndpoints } from '../src/api/endpoints.js';
import { createContactRepository } from '../src/api/repositories/contactRepository.js';
import { ApiError, ConfigError, NetworkError, TimeoutError } from '../src/core/errors.js';

describe('Scalable API Client & Contact Repository', () => {
  it('applies request and response interceptors and parses JSON', async () => {
    const client = new ApiClient({
      baseUrl: 'https://api.example.com',
      retryDelayMs: 1,
      fetchImpl: async (url, init) => {
        assert.equal(url, 'https://api.example.com/v1/ping');
        assert.equal(init.headers['X-Client-Version'], '2.0');
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' }
        });
      }
    });

    client.addRequestInterceptor((ctx) => ({
      ...ctx,
      headers: { ...ctx.headers, 'X-Client-Version': '2.0' }
    }));
    client.addResponseInterceptor((res) => ({
      ...res,
      intercepted: true
    }));

    const res = await client.get('/v1/ping');
    assert.equal(res.ok, true);
    assert.deepEqual(res.data, { ok: true });
    assert.equal(res.intercepted, true);
  });

  it('retries transient 503 responses and eventually succeeds', async () => {
    let attempts = 0;
    const client = new ApiClient({
      maxRetries: 2,
      retryDelayMs: 5,
      fetchImpl: async () => {
        attempts++;
        if (attempts < 3) {
          return new Response(JSON.stringify({ error: 'busy' }), {
            status: 503,
            headers: { 'content-type': 'application/json' }
          });
        }
        return new Response(JSON.stringify({ recovered: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' }
        });
      }
    });

    const res = await client.post('https://api.example.com/submit', { hello: 'world' });
    assert.equal(attempts, 3);
    assert.deepEqual(res.data, { recovered: true });
  });

  it('does not retry 400 client errors and throws ApiError', async () => {
    let attempts = 0;
    const client = new ApiClient({
      maxRetries: 2,
      retryDelayMs: 5,
      fetchImpl: async () => {
        attempts++;
        return new Response(JSON.stringify({ error: 'bad input' }), {
          status: 400,
          headers: { 'content-type': 'application/json' }
        });
      }
    });

    await assert.rejects(
      () => client.post('https://api.example.com/submit', {}),
      (err) => err instanceof ApiError && err.statusCode === 400
    );
    assert.equal(attempts, 1);
  });

  it('maps aborted requests to TimeoutError and TypeError to NetworkError', async () => {
    const slowClient = new ApiClient({
      timeoutMs: 25,
      maxRetries: 0,
      fetchImpl: (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => {
            const abortErr = new Error('Aborted');
            abortErr.name = 'AbortError';
            reject(abortErr);
          });
        })
    });

    await assert.rejects(() => slowClient.get('https://api.example.com/slow'), TimeoutError);

    const offlineClient = new ApiClient({
      maxRetries: 0,
      fetchImpl: async () => {
        throw new TypeError('Failed to fetch');
      }
    });

    await assert.rejects(() => offlineClient.get('https://api.example.com/down'), NetworkError);
  });

  it('orchestrates dual-channel delivery and catches FormSubmit soft failures', async () => {
    const calls = [];
    const client = new ApiClient({
      maxRetries: 0,
      fetchImpl: async (url) => {
        calls.push(url);
        if (url.includes('script.google.com')) {
          return { type: 'opaque', ok: false, status: 0 };
        }
        return new Response(JSON.stringify({ success: 'true' }), {
          status: 200,
          headers: { 'content-type': 'application/json' }
        });
      }
    });

    const endpoints = createEndpoints({
      api: {
        baseUrl: '',
        endpoints: {
          googleAppsScriptUrl: 'https://script.google.com/macros/s/demo/exec',
          formSubmitUrl: 'https://formsubmit.co/ajax/test@example.com'
        }
      }
    });

    const repo = createContactRepository({ apiClient: client, endpoints });
    const result = await repo.submitInquiry({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Research',
      message: 'Hello Mohan!',
      referenceId: 'INQ-123456',
      submittedAtFormatted: 'Nov 11, 2026'
    });

    assert.equal(calls.length, 2);
    assert.equal(result.channels.primary, 'formSubmit');
    assert.equal(result.channels.secondaryDispatched, true);

    const emptyEndpoints = createEndpoints({ api: { baseUrl: '', endpoints: {} } });
    const emptyRepo = createContactRepository({ apiClient: client, endpoints: emptyEndpoints });
    await assert.rejects(() => emptyRepo.submitInquiry({}), ConfigError);
  });
});

