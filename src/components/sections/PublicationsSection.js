/**
 * @fileoverview Publications Section Component (IEEE ICNPCV 2026).
 */

import { clearElement, el } from '../../core/dom.js';
import { actions } from '../../state/actions.js';
import { createBadge } from '../ui/Badge.js';
import { createButton } from '../ui/Button.js';
import { createIcon } from '../ui/Icon.js';
import { createSectionHeader } from '../ui/SectionHeader.js';

/**
 * Renders peer-reviewed publications and wires PDF modal preview actions.
 *
 * @param {HTMLElement} container
 * @param {object} deps
 * @param {Array<object>} deps.publications
 * @param {object} deps.store
 */
export function renderPublicationsSection(container, { publications, store }) {
  clearElement(container);

  const cards = publications.map((pub) =>
    el('article', { className: 'pub-specimen-card' }, [
      el('div', { className: 'pub-specimen-header' }, [
        el(
          'div',
          { className: 'pub-badge-row' },
          pub.badges.map((b) => createBadge(b))
        ),
        el('span', { className: 'pub-date tabular', text: pub.presentationDate })
      ]),
      el('h3', { className: 'pub-paper-title', text: pub.title }),
      el('div', { className: 'pub-venue-strip' }, [
        el('div', { className: 'venue-icon', attrs: { 'aria-hidden': 'true' } }, [
          createIcon('book', { size: 22 })
        ]),
        el('div', { className: 'venue-text' }, [
          el('strong', { text: pub.venue.conference }),
          el('br'),
          el('span', { text: pub.venue.metadata })
        ])
      ]),
      el(
        'p',
        { className: 'pub-abstract' },
        pub.abstractSegments.map((seg) => (seg.strong ? el('strong', { text: seg.text }) : seg.text))
      ),
      el(
        'div',
        { className: 'pub-metrics-grid' },
        pub.metrics.map((metric) =>
          el('div', { className: 'pub-metric-box' }, [
            el('span', { className: 'pub-metric-val tabular', text: metric.value }),
            el('span', { className: 'pub-metric-label', text: metric.label })
          ])
        )
      ),
      el('div', { className: 'pub-footer-actions' }, [
        createButton({
          id: `open-paper-pdf-btn-${pub.id}`,
          label: 'Read Paper (PDF Preview)',
          variant: 'primary',
          size: 'sm',
          icon: 'document',
          iconSize: 15,
          onClick: (event) => {
            event.preventDefault();
            store.dispatch(
              actions.openPdfModal({
                title: pub.pdf.title,
                src: pub.pdf.url,
                downloadName: pub.pdf.downloadName,
                triggerElementId: `open-paper-pdf-btn-${pub.id}`
              })
            );
          }
        }),
        createButton({
          label: 'Download Paper PDF',
          variant: 'secondary',
          size: 'sm',
          icon: 'download',
          iconSize: 14,
          href: pub.pdf.url,
          download: pub.pdf.downloadName
        })
      ])
    ])
  );

  container.appendChild(
    el('div', { className: 'container' }, [
      createSectionHeader({ title: 'Publications' }),
      ...cards
    ])
  );
}

