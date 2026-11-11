/**
 * @fileoverview Contact Section & Reactive Inquiry Form Component.
 * Connects UI interactions strictly to `contactService`, `clipboardService`, and the store.
 */

import { clearElement, el } from '../../core/dom.js';
import { RateLimitError, ValidationError, normalizeError } from '../../core/errors.js';
import { sanitizeUrl } from '../../core/sanitize.js';
import { actions } from '../../state/actions.js';
import { selectors } from '../../state/selectors.js';
import { createIcon } from '../ui/Icon.js';
import { createSectionHeader } from '../ui/SectionHeader.js';

function createChannelCard(channel, { clipboardService, notify }) {
  const iconBox = el('div', { className: 'channel-icon-box', attrs: { 'aria-hidden': 'true' } }, [
    createIcon(channel.icon)
  ]);

  if (channel.type === 'external') {
    return el(
      'a',
      {
        className: 'channel-card',
        attrs: {
          href: sanitizeUrl(channel.href),
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      },
      [
        el('div', { className: 'channel-icon-group' }, [
          iconBox,
          el('div', { className: 'channel-details' }, [
            el('span', { className: 'channel-name', text: channel.name }),
            el('span', { className: 'channel-val', text: channel.displayValue })
          ])
        ])
      ]
    );
  }

  return el('div', { className: 'channel-card' }, [
    el('div', { className: 'channel-icon-group' }, [
      iconBox,
      el('div', { className: 'channel-details' }, [
        el('span', { className: 'channel-name', text: channel.name }),
        el('a', {
          className: channel.tabular ? 'channel-val tabular' : 'channel-val',
          text: channel.displayValue,
          attrs: { href: sanitizeUrl(channel.href) }
        })
      ])
    ]),
    el(
      'button',
      {
        className: 'copy-btn',
        attrs: {
          type: 'button',
          title: channel.copyLabel,
          'aria-label': channel.copyLabel
        },
        on: {
          click: async () => {
            try {
              await clipboardService.copyText(channel.copyValue);
              notify(channel.copyToast, 'success');
            } catch (err) {
              notify(err.message || 'Failed to copy to clipboard', 'error');
            }
          }
        }
      },
      [createIcon('copy')]
    )
  ]);
}

/**
 * Mounts the Contact section and subscribes form state updates to the store.
 *
 * @param {HTMLElement} container
 * @param {object} deps
 * @param {Array<object>} deps.channels
 * @param {string} deps.recipientEmail
 * @param {object} deps.store
 * @param {object} deps.contactService
 * @param {object} deps.clipboardService
 * @param {(msg: string, variant?: string) => void} deps.notify
 * @returns {() => void} Cleanup unsubscribe function.
 */
export function mountContactSection(
  container,
  { channels, recipientEmail, store, contactService, clipboardService, notify }
) {
  clearElement(container);

  const hpInput = el('input', {
    className: 'hp-field',
    attrs: {
      type: 'text',
      name: '_gotcha_hp',
      tabindex: '-1',
      autocomplete: 'off',
      'aria-hidden': 'true'
    }
  });

  const nameErrorEl = el('span', { className: 'form-field-error', id: 'error-form-name' });
  const emailErrorEl = el('span', { className: 'form-field-error', id: 'error-form-email' });
  const subjectErrorEl = el('span', { className: 'form-field-error', id: 'error-form-subject' });
  const messageErrorEl = el('span', { className: 'form-field-error', id: 'error-form-message' });

  const clearErrorOnInput = (fieldName) => () => {
    store.dispatch(actions.clearContactFieldError(fieldName));
  };

  const nameInput = el('input', {
    id: 'form-name',
    className: 'form-input',
    attrs: {
      type: 'text',
      name: 'name',
      placeholder: 'Your full name',
      required: true,
      autocomplete: 'name',
      'aria-describedby': 'error-form-name'
    },
    on: { input: clearErrorOnInput('name') }
  });

  const emailInput = el('input', {
    id: 'form-email',
    className: 'form-input',
    attrs: {
      type: 'email',
      name: 'email',
      placeholder: 'you@company.com',
      required: true,
      autocomplete: 'email',
      'aria-describedby': 'error-form-email'
    },
    on: { input: clearErrorOnInput('email') }
  });

  const subjectInput = el('input', {
    id: 'form-subject',
    className: 'form-input',
    attrs: {
      type: 'text',
      name: 'subject',
      placeholder: 'e.g. AI/ML Role or Project Collaboration',
      'aria-describedby': 'error-form-subject'
    },
    on: { input: clearErrorOnInput('subject') }
  });

  const messageTextarea = el('textarea', {
    id: 'form-message',
    className: 'form-textarea',
    attrs: {
      name: 'message',
      placeholder: 'Share details about the role, project scope, or inquiry...',
      required: true,
      'aria-describedby': 'error-form-message'
    },
    on: { input: clearErrorOnInput('message') }
  });

  const statusBox = el('div', {
    id: 'form-status',
    className: 'form-status',
    attrs: { 'aria-live': 'polite' }
  });

  const submitBtnLabel = el('span', { text: 'Send Direct Message' });
  const submitBtnIcon = createIcon('arrowRight', { className: 'btn-arrow' });
  const submitBtn = el(
    'button',
    {
      id: 'btn-submit-form',
      className: 'btn btn-primary',
      attrs: { type: 'submit' }
    },
    [submitBtnLabel, submitBtnIcon]
  );

  const form = el(
    'form',
    {
      id: 'contact-form',
      className: 'contact-form-panel',
      attrs: { novalidate: true }
    },
    [
      hpInput,
      el('div', { className: 'form-row' }, [
        el('div', { className: 'form-group' }, [
          el('label', { className: 'form-label', text: 'Name', attrs: { for: 'form-name' } }),
          nameInput,
          nameErrorEl
        ]),
        el('div', { className: 'form-group' }, [
          el('label', { className: 'form-label', text: 'Email', attrs: { for: 'form-email' } }),
          emailInput,
          emailErrorEl
        ])
      ]),
      el('div', { className: 'form-group' }, [
        el('label', { className: 'form-label', text: 'Subject', attrs: { for: 'form-subject' } }),
        subjectInput,
        subjectErrorEl
      ]),
      el('div', { className: 'form-group' }, [
        el('label', { className: 'form-label', text: 'Message', attrs: { for: 'form-message' } }),
        messageTextarea,
        messageErrorEl
      ]),
      statusBox,
      submitBtn
    ]
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (selectors.isContactSubmitting(store.getState())) return;

    store.dispatch(actions.startContactSubmit());

    try {
      const result = await contactService.submitInquiry({
        name: nameInput.value,
        email: emailInput.value,
        subject: subjectInput.value,
        message: messageTextarea.value,
        honeypot: hpInput.value
      });

      if (result.botDropped) {
        store.dispatch(actions.resetContactStatus());
        return;
      }

      store.dispatch(
        actions.contactSubmitSuccess({
          submission: result.submission,
          cooldownUntil: result.cooldownUntil
        })
      );
      notify(`Message sent! Ref: #${result.submission.id}`, 'success');
      form.reset();
    } catch (err) {
      if (err instanceof ValidationError) {
        store.dispatch(actions.contactValidationFailed(err.fieldErrors, err.message));
        const firstInvalid = [
          ['name', nameInput],
          ['email', emailInput],
          ['message', messageTextarea]
        ].find(([key]) => Boolean(err.fieldErrors[key]));
        firstInvalid?.[1]?.focus();
        return;
      }

      if (err instanceof RateLimitError) {
        store.dispatch(actions.contactSubmitFailure({ message: err.message }));
        notify(err.message, 'error');
        return;
      }

      const normalized = normalizeError(err, 'Direct delivery failed.');
      const refId = normalized.details?.refId || null;
      store.dispatch(
        actions.contactSubmitFailure({
          message: normalized.message,
          refId
        })
      );
      notify('Remote delivery failed — please email directly', 'error');
    }
  });

  container.appendChild(
    el('div', { className: 'container' }, [
      createSectionHeader({
        title: "Let's Connect",
        subtitle:
          'Always happy to connect, collaborate or chat about ML and SDE. Feel free to reach out!'
      }),
      el('div', { className: 'contact-layout-grid' }, [
        el(
          'div',
          { className: 'contact-channels-column' },
          channels.map((ch) => createChannelCard(ch, { clipboardService, notify }))
        ),
        form
      ])
    ])
  );

  const fieldElements = {
    name: { input: nameInput, errorEl: nameErrorEl },
    email: { input: emailInput, errorEl: emailErrorEl },
    subject: { input: subjectInput, errorEl: subjectErrorEl },
    message: { input: messageTextarea, errorEl: messageErrorEl }
  };

  function syncFormUI(contactState) {
    const submitting = contactState.status === 'submitting';
    submitBtn.disabled = submitting;
    submitBtnLabel.textContent = submitting ? 'Sending Message...' : 'Send Direct Message';
    submitBtnIcon.style.display = submitting ? 'none' : '';

    // Sync inline field errors
    for (const [key, refs] of Object.entries(fieldElements)) {
      const errMsg = contactState.fieldErrors[key] || '';
      refs.errorEl.textContent = errMsg;
      refs.input.classList.toggle('is-invalid', Boolean(errMsg));
      refs.input.setAttribute('aria-invalid', String(Boolean(errMsg)));
    }

    // Sync status alert banner
    clearElement(statusBox);
    if (contactState.status === 'success' && contactState.lastSubmission) {
      const sub = contactState.lastSubmission;
      statusBox.className = 'form-status success visible';
      statusBox.appendChild(
        el('div', { className: 'form-status-body' }, [
          el('div', {
            className: 'form-status-title',
            text: `Thank you, ${sub.name}. Message sent.`
          }),
          el('p', { className: 'form-status-desc' }, [
            'Your inquiry has been dispatched. I will review and reply to ',
            el('strong', { text: sub.email }),
            '.'
          ]),
          el('div', { className: 'form-status-meta' }, [
            el('span', { className: 'form-status-ref tabular', text: `Ref: #${sub.id}` }),
            el('span', { className: 'form-status-note', text: '• Dispatched' })
          ])
        ])
      );
    } else if (contactState.status === 'error' && contactState.errorMessage) {
      statusBox.className = 'form-status error visible';
      const hasFieldErrors = Object.keys(contactState.fieldErrors).length > 0;
      if (hasFieldErrors) {
        statusBox.textContent = contactState.errorMessage;
      } else {
        statusBox.appendChild(
          el('div', { className: 'form-status-body' }, [
            el('div', { className: 'form-status-title', text: 'Direct delivery failed' }),
            el('p', { className: 'form-status-desc' }, [
              contactState.failedRefId
                ? 'Saved locally in your browser, but remote dispatch timed out or was blocked. Please email '
                : `${contactState.errorMessage} Or email `,
              el('strong', { text: recipientEmail }),
              ' directly.'
            ]),
            contactState.failedRefId
              ? el('div', { className: 'form-status-meta' }, [
                  el('span', {
                    className: 'form-status-note',
                    text: `Ref: #${contactState.failedRefId}`
                  })
                ])
              : null
          ])
        );
      }
    } else {
      statusBox.className = 'form-status';
    }
  }

  return store.select(selectors.getContactState, syncFormUI, { emitImmediate: true });
}

