/**
 * @fileoverview Hero Section Component.
 */

import { clearElement, el } from '../../core/dom.js';
import { createButton } from '../ui/Button.js';

/**
 * Renders the Hero Header Section.
 *
 * @param {HTMLElement} container
 * @param {object} deps
 * @param {object} deps.profile
 */
export function renderHeroSection(container, { profile }) {
  clearElement(container);

  const avatarFrame = el('div', { className: 'hero-avatar-frame' });
  const avatarImg = el('img', {
    className: 'hero-avatar-img',
    attrs: {
      src: profile.avatar.src,
      alt: profile.avatar.alt,
      width: profile.avatar.width,
      height: profile.avatar.height
    }
  });

  avatarImg.addEventListener('error', () => {
    clearElement(avatarFrame);
    avatarFrame.appendChild(
      el('span', {
        className: 'media-fallback-label',
        text: `${profile.monogram} • Portrait unavailable`
      })
    );
  });

  avatarFrame.appendChild(avatarImg);

  const content = el('div', { className: 'container' }, [
    el('div', { className: 'hero-grid' }, [
      el('div', { className: 'hero-content' }, [
        el('div', { className: 'hero-status-strip' }, [
          el('span', { className: 'status-dot', attrs: { 'aria-hidden': 'true' } }),
          el('span', { text: profile.availability })
        ]),
        el('h1', { className: 'hero-title', text: profile.fullName }),
        el('div', { className: 'hero-role', text: profile.role }),
        el('p', { className: 'hero-lead', text: profile.heroLead }),
        el(
          'div',
          { className: 'hero-credentials-row' },
          profile.credentials.map((cred) =>
            el('span', { className: 'credential-chip' }, [
              el('span', { text: cred.label }),
              ' ',
              el('strong', { text: cred.value })
            ])
          )
        ),
        el('div', { className: 'hero-actions' }, [
          createButton({
            label: 'Explore Research & Systems',
            variant: 'primary',
            icon: 'arrowRight',
            iconPosition: 'right',
            iconClassName: 'btn-arrow',
            href: '#projects'
          }),
          createButton({
            label: 'Download CV',
            variant: 'secondary',
            icon: 'download',
            iconSize: 15,
            href: profile.resume.url,
            download: profile.resume.downloadName,
            external: true,
            title: 'Download Mohan Kumar B.H Resume (PDF)'
          })
        ])
      ]),
      el('div', { className: 'hero-avatar-panel' }, [avatarFrame])
    ])
  ]);

  container.appendChild(content);
}

