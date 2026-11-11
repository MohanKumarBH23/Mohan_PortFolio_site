/**
 * @fileoverview Reactive Toast Notification Component & Dispatcher Helper.
 */

import { clearElement, el } from '../../core/dom.js';
import { actions } from '../../state/actions.js';
import { selectors } from '../../state/selectors.js';

/**
 * Helper to publish auto-dismissing toast notifications via the store.
 *
 * @param {object} store
 * @returns {(message: string, variant?: 'info' | 'success' | 'error') => void}
 */
export function createToastNotifier(store) {
  let counter = 0;

  return function notify(message, variant = 'info') {
    const id = `toast-${Date.now()}-${++counter}`;
    store.dispatch(actions.addToast({ id, message, variant }));

    setTimeout(() => {
      store.dispatch(actions.markToastLeaving(id));
      setTimeout(() => {
        store.dispatch(actions.removeToast(id));
      }, 240);
    }, 3200);
  };
}

/**
 * Mounts the reactive toast container subscribed to store toast items.
 *
 * @param {HTMLElement} container
 * @param {object} store
 * @returns {() => void} Unsubscribe callback.
 */
export function mountToastContainer(container, store) {
  container.className = 'toast-container';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('role', 'status');

  function render(items) {
    clearElement(container);
    for (const item of items) {
      const classes = [
        'toast',
        item.variant === 'error' ? 'toast-error' : '',
        item.variant === 'success' ? 'toast-success' : '',
        item.leaving ? 'toast-leaving' : ''
      ]
        .filter(Boolean)
        .join(' ');

      container.appendChild(
        el('div', { className: classes }, [
          el('span', { className: 'toast-indicator', attrs: { 'aria-hidden': 'true' } }),
          el('span', { text: item.message })
        ])
      );
    }
  }

  return store.select(selectors.getToasts, render, { emitImmediate: true });
}

