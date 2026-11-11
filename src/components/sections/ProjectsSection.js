/**
 * @fileoverview Projects Showcase Section Component.
 * Renders the featured engineering case study with architecture pipeline diagram
 * and the secondary project grid from `projectService`.
 */

import { clearElement, el } from '../../core/dom.js';
import { sanitizeUrl } from '../../core/sanitize.js';
import { actions } from '../../state/actions.js';
import { createSkillTag } from '../ui/Badge.js';
import { createIcon } from '../ui/Icon.js';
import { createSectionHeader } from '../ui/SectionHeader.js';

function createDetailsButton(project, store) {
  const buttonId = `project-details-${project.id}`;
  return el(
    'button',
    {
      id: buttonId,
      className: 'view-details-btn',
      attrs: { type: 'button' },
      on: {
        click: (event) => {
          event.preventDefault();
          store.dispatch(actions.openProjectModal(project.id, buttonId));
        }
      }
    },
    [
      el('span', { text: project.ctaLabel }),
      el('span', { text: '→', attrs: { 'aria-hidden': 'true' } })
    ]
  );
}

function renderFeaturedProject(project, store) {
  const diagram = project.pipelineDiagram;

  return el('article', { className: 'featured-project-card' }, [
    el('div', { className: 'featured-project-info' }, [
      el('div', { className: 'project-domain-tag', text: project.domainTag }),
      el('h3', { className: 'featured-project-title', text: project.cardTitle }),
      el('p', { className: 'project-summary', text: project.cardSummary }),
      el(
        'div',
        { className: 'project-tags-row' },
        project.cardTags.map((tag) => createSkillTag(tag))
      ),
      el('div', { className: 'project-footer-row' }, [
        createDetailsButton(project, store),
        el('span', {
          className: 'tabular project-meta-year project-meta-year--featured',
          text: project.cardMeta
        })
      ])
    ]),
    diagram
      ? el('div', { className: 'featured-project-diagram' }, [
          el('div', { className: 'diagram-header' }, [
            el('span', { text: diagram.title }),
            el('span', { text: diagram.telemetry })
          ]),
          el(
            'div',
            { className: 'pipeline-steps' },
            diagram.nodes.map((node) =>
              el(
                'div',
                { className: node.accent ? 'pipeline-node accent' : 'pipeline-node' },
                [
                  el('span', { text: node.step }),
                  el('span', { className: 'tabular', text: node.detail })
                ]
              )
            )
          )
        ])
      : null
  ]);
}

function renderProjectCaseCard(project, store) {
  return el('article', { className: 'project-case-card' }, [
    el('div', { className: 'project-case-header' }, [
      el('span', { className: 'project-domain-tag', text: project.domainTag }),
      el(
        'a',
        {
          className: 'copy-btn',
          attrs: {
            href: sanitizeUrl(project.githubUrl),
            target: '_blank',
            rel: 'noopener noreferrer',
            title: 'View on GitHub',
            'aria-label': `${project.cardTitle} GitHub Repository`
          }
        },
        [createIcon('github', { size: 15 })]
      )
    ]),
    el('h4', { className: 'project-case-title', text: project.cardTitle }),
    el('p', { className: 'project-case-desc', text: project.cardSummary }),
    el(
      'div',
      { className: 'project-tags-row' },
      project.cardTags.map((tag) => createSkillTag(tag))
    ),
    el('div', { className: 'project-footer-row' }, [
      createDetailsButton(project, store),
      el('span', { className: 'tabular project-meta-year', text: project.cardMeta })
    ])
  ]);
}

/**
 * Renders the Projects section from `projectService`.
 *
 * @param {HTMLElement} container
 * @param {object} deps
 * @param {object} deps.projectService
 * @param {object} deps.store
 */
export function renderProjectsSection(container, { projectService, store }) {
  clearElement(container);

  const featured = projectService.getFeaturedProject();
  const secondary = projectService.getSecondaryProjects();

  container.appendChild(
    el('div', { className: 'container' }, [
      createSectionHeader({
        title: 'Projects',
        subtitle:
          'Engineered machine learning systems, from edge vision pipelines to multimodal speech interfaces.'
      }),
      el('div', { className: 'projects-container' }, [
        featured ? renderFeaturedProject(featured, store) : null,
        el(
          'div',
          { className: 'sub-projects-grid' },
          secondary.map((project) => renderProjectCaseCard(project, store))
        )
      ])
    ])
  );
}

