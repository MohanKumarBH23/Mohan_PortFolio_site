/**
 * @fileoverview Project Case-Study Detail Modal Component.
 * Subscribed to `store` modal slice; delegates error handling cleanly when a project is missing.
 */

import { clearElement, el } from '../../core/dom.js';
import { sanitizeUrl } from '../../core/sanitize.js';
import { actions } from '../../state/actions.js';
import { selectors } from '../../state/selectors.js';
import { createBadge } from '../ui/Badge.js';
import { createButton } from '../ui/Button.js';
import { createModalController } from '../ui/Modal.js';

/**
 * Mounts the Project Detail Modal subscriber.
 *
 * @param {HTMLElement} backdrop
 * @param {object} deps
 * @param {object} deps.store
 * @param {object} deps.projectService
 * @param {object} deps.logger
 * @param {(msg: string, variant?: string) => void} deps.notify
 * @returns {() => void} Cleanup unsubscribe function.
 */
export function mountProjectDetailModal(backdrop, { store, projectService, logger, notify }) {
  const contentContainer = backdrop.querySelector('#project-modal-content');
  const closeBtn = backdrop.querySelector('#modal-close-btn');

  const controller = createModalController({
    backdrop,
    closeButton: closeBtn,
    onClose: () => store.dispatch(actions.closeModal())
  });

  function renderProjectDetails(project) {
    const data = project.modal;
    clearElement(contentContainer);

    const previewSection = data.image
      ? (() => {
          const box = el('div', { className: 'modal-preview-box' });
          const img = el('img', {
            className: 'modal-preview-img',
            attrs: {
              src: sanitizeUrl(data.image),
              alt: data.title
            }
          });
          img.addEventListener('error', () => {
            clearElement(box);
            box.appendChild(
              el('p', {
                className: 'media-fallback-label',
                text: 'Runtime preview image could not be loaded.'
              })
            );
          });
          box.appendChild(img);
          box.appendChild(
            el('div', {
              className: 'modal-preview-caption',
              text: data.imageCaption || 'Execution Preview'
            })
          );

          return el('div', { className: 'modal-section' }, [
            el('h4', {
              className: 'modal-section-title',
              text: data.imageTitle || 'Visual Interface & Runtime Preview'
            }),
            box
          ]);
        })()
      : null;

    const fragment = el('div', {}, [
      el('div', { className: 'modal-header' }, [
        createBadge({ label: data.badge, variant: 'conf', className: 'modal-badge' }),
        el('h2', { id: 'project-modal-title', className: 'modal-title', text: data.title }),
        el('p', { className: 'modal-category', text: data.category })
      ]),
      el('div', { className: 'modal-section' }, [
        el('h4', { className: 'modal-section-title', text: 'System Overview' }),
        el('p', { className: 'modal-overview', text: data.overview })
      ]),
      el('div', { className: 'modal-section' }, [
        el('h4', { className: 'modal-section-title', text: 'Architecture & Technical Design' }),
        el(
          'ul',
          { className: 'modal-arch-list' },
          data.architecture.map((item) =>
            el('li', { className: 'modal-arch-item' }, [
              el('span', { className: 'modal-arch-bullet', attrs: { 'aria-hidden': 'true' } }),
              el('span', { text: item })
            ])
          )
        )
      ]),
      el('div', { className: 'modal-section' }, [
        el('h4', { className: 'modal-section-title', text: 'Key Engineering Highlights' }),
        el(
          'div',
          { className: 'modal-metrics-grid' },
          data.metrics.map((m) =>
            el('div', { className: 'modal-metric-box' }, [
              el('div', { className: 'modal-metric-val tabular', text: m.value }),
              el('div', { className: 'modal-metric-label', text: m.label })
            ])
          )
        )
      ]),
      previewSection,
      el('div', { className: 'modal-section' }, [
        el('h4', { className: 'modal-section-title', text: 'Source Implementation Excerpt' }),
        el('pre', { className: 'modal-code-block' }, [
          el('code', { text: data.codeSnippet })
        ])
      ]),
      el('div', { className: 'modal-actions' }, [
        data.pdfUrl
          ? createButton({
              label: 'Open Paper (PDF)',
              variant: 'primary',
              size: 'sm',
              icon: 'document',
              iconSize: 14,
              href: data.pdfUrl,
              external: true
            })
          : null,
        createButton({
          label: 'Repository ↗',
          variant: 'secondary',
          size: 'sm',
          icon: 'github',
          iconSize: 14,
          href: data.githubUrl,
          external: true
        })
      ])
    ]);

    contentContainer.appendChild(fragment);
  }

  return store.select(
    (state) => state.modal,
    (modalSlice) => {
      const active = modalSlice.active;
      if (active && active.type === 'project') {
        try {
          const project = projectService.getProjectById(active.projectId);
          renderProjectDetails(project);
          controller.setActive(true, modalSlice.triggerElementId);
        } catch (err) {
          logger?.error('Failed to open project modal', {
            projectId: active.projectId,
            error: err.message
          });
          notify('Requested project details could not be loaded.', 'error');
          store.dispatch(actions.closeModal());
        }
      } else {
        controller.setActive(false);
      }
    },
    { emitImmediate: true }
  );
}

