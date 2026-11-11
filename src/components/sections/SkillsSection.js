/**
 * @fileoverview Technical Matrix (Skills) Section Component.
 */

import { clearElement, el } from '../../core/dom.js';
import { createSkillTag } from '../ui/Badge.js';
import { createIcon } from '../ui/Icon.js';
import { createSectionHeader } from '../ui/SectionHeader.js';

/**
 * Renders the 5-domain Technical Matrix section.
 *
 * @param {HTMLElement} container
 * @param {object} deps
 * @param {Array<object>} deps.domains
 */
export function renderSkillsSection(container, { domains }) {
  clearElement(container);

  const cards = domains.map((domain) =>
    el('div', { className: 'skill-domain-card' }, [
      el('div', { className: 'skill-domain-header' }, [
        el('div', { className: 'domain-icon-box', attrs: { 'aria-hidden': 'true' } }, [
          createIcon(domain.icon)
        ]),
        el('h3', { className: 'skill-domain-title', text: domain.title })
      ]),
      el('div', { className: 'skill-domain-body' }, [
        el(
          'div',
          { className: 'skill-items-list' },
          domain.skills.map((skill) => createSkillTag(skill))
        )
      ])
    ])
  );

  container.appendChild(
    el('div', { className: 'container' }, [
      createSectionHeader({ title: 'Technical Matrix' }),
      el('div', { className: 'skills-taxonomy-grid' }, cards)
    ])
  );
}

