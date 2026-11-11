/**
 * @fileoverview About Me Section Component.
 */

import { clearElement, el } from '../../core/dom.js';
import { createSectionHeader } from '../ui/SectionHeader.js';

/**
 * Renders the About section with bio thesis and verified credentials ledger.
 *
 * @param {HTMLElement} container
 * @param {object} deps
 * @param {object} deps.profile
 */
export function renderAboutSection(container, { profile }) {
  clearElement(container);

  const thesisParagraphs = profile.aboutParagraphs.map((segments) =>
    el(
      'p',
      {},
      segments.map((seg) => (seg.strong ? el('strong', { text: seg.text }) : seg.text))
    )
  );

  const ledgerItems = profile.ledger.map((item) =>
    el('div', { className: 'ledger-item' }, [
      el('span', { className: 'ledger-label', text: item.label }),
      el('span', { className: 'ledger-val', text: item.value })
    ])
  );

  container.appendChild(
    el('div', { className: 'container' }, [
      createSectionHeader({ title: 'About Me' }),
      el('div', { className: 'about-grid' }, [
        el('div', { className: 'about-thesis' }, thesisParagraphs),
        el('div', { className: 'about-ledger' }, [
          el('div', { className: 'ledger-header', text: 'Verified Credentials' }),
          ...ledgerItems
        ])
      ])
    ])
  );
}

