/**
 * @fileoverview Reusable Badge & Skill Tag Components.
 */

import { el } from '../../core/dom.js';
import { createIcon } from './Icon.js';

/**
 * Renders a publication/modal badge element.
 *
 * @param {object} options
 * @param {string} options.label
 * @param {'ieee' | 'conf'} [options.variant='conf']
 * @param {string} [options.icon]
 * @param {string} [options.className]
 * @returns {HTMLElement}
 */
export function createBadge({ label, variant = 'conf', icon, className = '' }) {
  const classes = [
    'pub-badge',
    variant === 'ieee' ? 'pub-badge-ieee' : 'pub-badge-conf',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return el('span', { className: classes }, [
    icon ? createIcon(icon, { size: 14 }) : null,
    label
  ]);
}

/**
 * Renders a technical skill or project stack tag.
 *
 * @param {string} label
 * @returns {HTMLElement}
 */
export function createSkillTag(label) {
  return el('span', { className: 'skill-tag', text: label });
}

