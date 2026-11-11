/**
 * @fileoverview Footer Component.
 */

import { clearElement, el } from '../../core/dom.js';

/**
 * Renders the portfolio footer.
 *
 * @param {HTMLElement} container
 * @param {object} deps
 * @param {object} deps.profile
 * @param {Array<object>} deps.navItems
 */
export function renderFooter(container, { profile, navItems }) {
  clearElement(container);

  container.appendChild(
    el('div', { className: 'container' }, [
      el('div', { className: 'footer-content' }, [
        el('div', { className: 'footer-brand' }, [
          el('h4', { text: profile.fullName }),
          el('p', { text: profile.locationShort })
        ]),
        el(
          'div',
          { className: 'footer-links', attrs: { 'aria-label': 'Footer Navigation' } },
          navItems.map((item) =>
            el('a', { text: item.label, attrs: { href: item.href } })
          )
        )
      ])
    ])
  );
}

