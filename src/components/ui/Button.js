/**
 * @fileoverview Reusable Button & Action Link Component.
 */

import { el } from '../../core/dom.js';
import { sanitizeUrl } from '../../core/sanitize.js';
import { createIcon } from './Icon.js';

/**
 * Builds either a `<button>` or styled `<a>` CTA element consistently.
 *
 * @param {object} options
 * @param {string} options.label
 * @param {'primary' | 'secondary'} [options.variant='primary']
 * @param {'md' | 'sm'} [options.size='md']
 * @param {string} [options.icon]
 * @param {'left' | 'right'} [options.iconPosition='left']
 * @param {string} [options.iconClassName]
 * @param {number} [options.iconSize]
 * @param {string} [options.href]
 * @param {string} [options.download]
 * @param {boolean} [options.external=false]
 * @param {'button' | 'submit'} [options.type='button']
 * @param {string} [options.id]
 * @param {string} [options.title]
 * @param {string} [options.className]
 * @param {EventListener} [options.onClick]
 * @returns {HTMLButtonElement | HTMLAnchorElement}
 */
export function createButton({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  iconClassName,
  iconSize,
  href,
  download,
  external = false,
  type = 'button',
  id,
  title,
  className = '',
  onClick
}) {
  const classes = [
    'btn',
    variant === 'secondary' ? 'btn-secondary' : 'btn-primary',
    size === 'sm' ? 'btn-sm' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const iconEl = icon
    ? createIcon(icon, { size: iconSize, className: iconClassName })
    : null;
  const labelEl = el('span', { text: label });

  const children =
    iconPosition === 'right' ? [labelEl, iconEl] : [iconEl, labelEl];

  if (href) {
    const attrs = {
      href: sanitizeUrl(href),
      title
    };
    if (download) attrs.download = download;
    if (external) {
      attrs.target = '_blank';
      attrs.rel = 'noopener noreferrer';
    }
    return el('a', { id, className: classes, attrs, on: onClick ? { click: onClick } : undefined }, children);
  }

  return el(
    'button',
    {
      id,
      className: classes,
      attrs: { type, title },
      on: onClick ? { click: onClick } : undefined
    },
    children
  );
}

