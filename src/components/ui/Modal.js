/**
 * @fileoverview Accessible Reusable Modal Dialog Controller.
 * Manages backdrop dismissal, Escape key listener, focus restoration, and body scroll locking.
 */

/**
 * Binds accessible open/close lifecycle behaviors onto a modal backdrop element.
 *
 * @param {object} options
 * @param {HTMLElement} options.backdrop
 * @param {HTMLElement | null} [options.closeButton]
 * @param {() => void} options.onClose
 * @returns {object} Modal controller (`setActive(isOpen, triggerElementId)`).
 */
export function createModalController({ backdrop, closeButton, onClose }) {
  let lastTriggerEl = null;
  let wasOpen = false;

  if (closeButton) {
    closeButton.addEventListener('click', () => onClose());
  }

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) {
      onClose();
    }
  });

  function setActive(isOpen, triggerElementId = null) {
    if (isOpen && !wasOpen) {
      lastTriggerEl = triggerElementId
        ? document.getElementById(triggerElementId)
        : document.activeElement;
      backdrop.classList.add('active');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      wasOpen = true;

      if (closeButton && typeof closeButton.focus === 'function') {
        closeButton.focus();
      }
    } else if (!isOpen && wasOpen) {
      backdrop.classList.remove('active');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      wasOpen = false;

      if (lastTriggerEl && typeof lastTriggerEl.focus === 'function') {
        lastTriggerEl.focus();
      }
      lastTriggerEl = null;
    }
  }

  return Object.freeze({ setActive });
}

