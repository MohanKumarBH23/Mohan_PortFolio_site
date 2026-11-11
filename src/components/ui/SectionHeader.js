/**
 * @fileoverview Reusable Section Header Component.
 */

import { el } from '../../core/dom.js';

/**
 * Renders a standardized portfolio section title and optional subtitle.
 *
 * @param {object} options
 * @param {string} options.title
 * @param {string} [options.subtitle]
 * @returns {HTMLElement}
 */
export function createSectionHeader({ title, subtitle }) {
  return el('div', { className: 'section-header' }, [
    el('h2', { className: 'section-title', text: title }),
    subtitle ? el('p', { className: 'section-subtitle', text: subtitle }) : null
  ]);
}

