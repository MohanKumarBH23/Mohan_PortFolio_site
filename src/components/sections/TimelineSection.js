/**
 * @fileoverview Experience & Academic Milestones Timeline Component.
 */

import { clearElement, el } from '../../core/dom.js';
import { createSectionHeader } from '../ui/SectionHeader.js';

function renderExperienceNode(item) {
  return el('div', { className: 'timeline-node' }, [
    el('span', { className: 'timeline-period-tag tabular', text: item.period }),
    el('div', { className: 'timeline-role-title', text: item.role }),
    el('div', { className: 'timeline-org-name', text: item.organization }),
    ...item.highlights.map((hl) =>
      el('p', { className: 'timeline-node-desc' }, [
        el('strong', { text: `• ${hl.title}` }),
        ` ${hl.description}`
      ])
    )
  ]);
}

function renderEducationNode(item) {
  return el('div', { className: 'timeline-node' }, [
    el('span', { className: 'timeline-period-tag tabular', text: item.period }),
    el('div', { className: 'timeline-role-title', text: item.role }),
    el('div', { className: 'timeline-org-name', text: item.organization }),
    item.grade ? el('span', { className: 'timeline-grade-badge tabular', text: item.grade }) : null,
    item.coursework ? el('p', { className: 'timeline-node-desc', text: item.coursework }) : null
  ]);
}

/**
 * Renders the dual-column Timeline section.
 *
 * @param {HTMLElement} container
 * @param {object} deps
 * @param {object} deps.timeline
 */
export function renderTimelineSection(container, { timeline }) {
  clearElement(container);

  container.appendChild(
    el('div', { className: 'container' }, [
      createSectionHeader({
        title: 'Timeline',
        subtitle: 'Professional industry engagements and academic milestones.'
      }),
      el('div', { className: 'timeline-dual-grid' }, [
        el('div', { className: 'timeline-column' }, [
          el('h3', { className: 'timeline-col-title', text: 'Industry Experience' }),
          el(
            'div',
            { className: 'timeline-items' },
            timeline.experience.map(renderExperienceNode)
          )
        ]),
        el('div', { id: 'education', className: 'timeline-column' }, [
          el('h3', { className: 'timeline-col-title', text: 'Academic Milestones' }),
          el(
            'div',
            { className: 'timeline-items' },
            timeline.education.map(renderEducationNode)
          )
        ])
      ])
    ])
  );
}

