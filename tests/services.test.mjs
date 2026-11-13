import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { createStorageService } from '../src/core/storage.js';
import { sanitizeUrl } from '../src/core/sanitize.js';
import { createContactService, validateContactInput } from '../src/services/contactService.js';
import { createProjectService } from '../src/services/projectService.js';
import { resolveActiveSection } from '../src/services/navigationService.js';
import { createClipboardService } from '../src/services/clipboardService.js';
import { PROJECTS } from '../src/data/projects.js';
import { NotFoundError, RateLimitError, ValidationError } from '../src/core/errors.js';

const testConfig = {
  contact: { cooldownMs: 30000, maxHistory: 5, locale: 'en-IN', timeZone: 'Asia/Kolkata' },
  storage: { inquiriesKey: 'i_key', cooldownKey: 'c_key' }
};

describe('Core Utilities & Business Services', () => {
  it('blocks unsafe URL schemes while allowing safe relative and HTTPS links', () => {
    assert.equal(sanitizeUrl('javascript:alert(1)'), '#');
    assert.equal(sanitizeUrl('assets/documents/Mohan_Resume.pdf'), 'assets/documents/Mohan_Resume.pdf');
    assert.equal(sanitizeUrl('https://github.com/MohanKumarBH23'), 'https://github.com/MohanKumarBH23');
  });

  it('recovers from corrupted JSON and failing storage backends', () => {
    const throwingBackend = {
      getItem: () => '{bad json',
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
      removeItem: () => {}
    };

    const storage = createStorageService({ backend: throwingBackend });
    assert.deepEqual(storage.getJSON('broken', []), []);
    assert.equal(storage.setString('k', 'v'), false);
    assert.equal(storage.getString('k'), 'v'); // In-memory fallback retains written value
  });

  it('validates contact input, blocks bots silently, and enforces rate limits', async () => {
    const invalid = validateContactInput({ name: 'A', email: 'bad', message: 'hi' });
    assert.equal(invalid.valid, false);
    assert.ok(invalid.fieldErrors.name);
    assert.ok(invalid.fieldErrors.email);
    assert.ok(invalid.fieldErrors.message);

    const storage = createStorageService({ backend: null });
    let dispatches = 0;
    const contactService = createContactService({
      config: testConfig,
      storage,
      contactRepository: {
        submitInquiry: async () => {
          dispatches++;
          return { delivered: true };
        }
      }
    });

    // Honeypot drop
    const botRes = await contactService.submitInquiry({
      name: 'Bot',
      email: 'bot@spam.com',
      message: 'Spam message content',
      honeypot: 'filled'
    });
    assert.equal(botRes.botDropped, true);
    assert.equal(dispatches, 0);

    // Validation failure
    await assert.rejects(
      () => contactService.submitInquiry({ name: '', email: 'x', message: '' }),
      ValidationError
    );

    // Valid submission + rate limit on immediate retry
    const okRes = await contactService.submitInquiry(
      { name: 'Recruiter', email: 'recruiter@company.com', message: 'Let us discuss an AI role.' },
      100000
    );
    assert.equal(okRes.botDropped, false);
    assert.match(okRes.submission.id, /^INQ-[A-Z0-9]{6}$/);
    assert.equal(contactService.getHistory().length, 1);

    await assert.rejects(
      () =>
        contactService.submitInquiry(
          { name: 'Recruiter', email: 'recruiter@company.com', message: 'Second inquiry too soon.' },
          105000
        ),
      RateLimitError
    );
  });

  it('resolves projects, scroll-spy, and clipboard operations cleanly', async () => {
    const projectService = createProjectService(PROJECTS);
    assert.equal(projectService.getFeaturedProject().id, 'intelli-eye');
    assert.equal(projectService.getSecondaryProjects().length, 5);
    assert.equal(
      projectService.getProjectById('deltacheck').githubUrl,
      'https://github.com/MohanKumarBH23/Chat-Boot'
    );
    assert.throws(() => projectService.getProjectById('nonexistent'), NotFoundError);

    assert.equal(
      resolveActiveSection({
        scrollY: 600,
        sections: [
          { id: 'home', top: 0, bottom: 500 },
          { id: 'about', top: 500, bottom: 1000 }
        ]
      }),
      'about'
    );

    const clipboard = createClipboardService({
      clipboardApi: { writeText: async () => {} }
    });
    const copied = await clipboard.copyText('+919980507072');
    assert.deepEqual(copied, { copied: true, method: 'clipboard' });
  });
});

