/**
 * @fileoverview Research Paper PDF Viewer Modal Component.
 * Builds its header actions using reusable UI primitives (`Badge`, `Button`)
 * and manages iframe loading/error states cleanly.
 */

import { clearElement, el } from '../../core/dom.js';
import { sanitizeUrl } from '../../core/sanitize.js';
import { actions } from '../../state/actions.js';
import { createBadge } from '../ui/Badge.js';
import { createButton } from '../ui/Button.js';
import { createModalController } from '../ui/Modal.js';

/**
 * Mounts the PDF Viewer Modal subscriber into `#pdf-modal-backdrop`.
 *
 * @param {HTMLElement} backdrop
 * @param {object} deps
 * @param {object} deps.store
 * @param {object} deps.logger
 * @returns {() => void} Cleanup unsubscribe function.
 */
export function mountPdfViewerModal(backdrop, { store, logger }) {
  clearElement(backdrop);

  const badgeEl = createBadge({ label: 'IEEE ICNPCV ’26', variant: 'ieee' });
  const titleEl = el('h3', { id: 'pdf-modal-title', className: 'pdf-modal-title', text: 'Document Preview' });

  const openTabLink = createButton({
    id: 'pdf-open-tab-link',
    label: 'Open in Tab',
    variant: 'primary',
    size: 'sm',
    icon: 'externalLink',
    iconSize: 13,
    href: '#',
    external: true
  });

  const downloadLink = createButton({
    id: 'pdf-download-link',
    label: 'Download',
    variant: 'secondary',
    size: 'sm',
    icon: 'download',
    iconSize: 13,
    href: '#',
    download: 'document.pdf'
  });

  const closeBtn = el('button', {
    id: 'pdf-modal-close-btn',
    className: 'modal-close-btn',
    text: '×',
    attrs: { type: 'button', 'aria-label': 'Close PDF Viewer' }
  });

  const iframe = el('iframe', {
    id: 'pdf-iframe',
    attrs: { src: '', title: 'Research Paper PDF Viewer' }
  });

  const fallbackBannerText = el('span', {
    id: 'pdf-fallback-text',
    text: 'Viewing on mobile or having preview issues?'
  });

  const fallbackLink = createButton({
    id: 'pdf-fallback-link',
    label: 'Open Paper in New Tab ↗',
    variant: 'primary',
    size: 'sm',
    href: '#',
    external: true
  });

  const modalShell = el('div', { className: 'project-modal pdf-modal-container' }, [
    el('div', { className: 'pdf-modal-header' }, [
      el('div', { className: 'pdf-modal-title-group' }, [badgeEl, titleEl]),
      el('div', { className: 'pdf-modal-actions' }, [openTabLink, downloadLink, closeBtn])
    ]),
    el('div', { className: 'pdf-frame-wrapper' }, [
      iframe,
      el('div', { className: 'pdf-fallback-banner' }, [fallbackBannerText, fallbackLink])
    ])
  ]);

  backdrop.appendChild(modalShell);

  const controller = createModalController({
    backdrop,
    closeButton: closeBtn,
    onClose: () => store.dispatch(actions.closeModal())
  });

  iframe.addEventListener('load', () => {
    if (iframe.getAttribute('src')) {
      store.dispatch(actions.setPdfStatus('loaded'));
    }
  });

  iframe.addEventListener('error', () => {
    logger?.warn('PDF iframe encountered a loading error.');
    store.dispatch(actions.setPdfStatus('error'));
  });

  return store.select(
    (state) => state.modal,
    (modalSlice) => {
      const active = modalSlice.active;
      if (active && active.type === 'pdf') {
        const safeSrc = sanitizeUrl(active.src);
        titleEl.textContent = active.title;
        iframe.setAttribute('title', active.title);
        openTabLink.setAttribute('href', safeSrc);
        fallbackLink.setAttribute('href', safeSrc);
        downloadLink.setAttribute('href', safeSrc);
        if (active.downloadName) {
          downloadLink.setAttribute('download', active.downloadName);
        }

        if (iframe.getAttribute('src') !== safeSrc) {
          iframe.setAttribute('src', safeSrc);
        }

        fallbackBannerText.textContent =
          active.pdfStatus === 'error'
            ? 'Inline PDF preview unavailable in this browser. Open or download directly:'
            : 'Viewing on mobile or having preview issues?';

        controller.setActive(true, modalSlice.triggerElementId);
      } else {
        controller.setActive(false);
      }
    },
    { emitImmediate: true }
  );
}
