/**
 * @fileoverview Responsive Navigation Bar Component.
 * Subscribed to store slices (`activeSection`, `isScrolled`, `isMobileMenuOpen`, `theme`).
 */

import { clearElement, el } from '../../core/dom.js';
import { actions } from '../../state/actions.js';
import { selectors } from '../../state/selectors.js';
import { createButton } from '../ui/Button.js';
import { createIcon } from '../ui/Icon.js';

/**
 * Mounts the Navigation Bar and returns a cleanup callback.
 *
 * @param {HTMLElement} container
 * @param {object} deps
 * @param {object} deps.store
 * @param {object} deps.profile
 * @param {Array<object>} deps.navItems
 * @param {() => void} deps.onToggleTheme
 * @returns {() => void} Cleanup unsubscribe function.
 */
export function mountNavbar(container, { store, profile, navItems, onToggleTheme }) {
  clearElement(container);

  const linkElements = new Map();
  const menuList = el(
    'ul',
    { className: 'nav-menu', id: 'nav-menu' },
    navItems.map((item) => {
      const link = el('a', {
        className: 'nav-link',
        text: item.label,
        attrs: { href: item.href },
        on: {
          click: () => store.dispatch(actions.closeMobileMenu())
        }
      });
      linkElements.set(item.id, link);
      return el('li', {}, [link]);
    })
  );

  const themeToggleBtn = el(
    'button',
    {
      id: 'theme-toggle',
      className: 'theme-toggle',
      attrs: {
        type: 'button',
        'aria-label': 'Toggle visual theme',
        title: 'Toggle Dark Lacquer / Navy & Cream Theme'
      },
      on: { click: onToggleTheme }
    },
    [
      createIcon('sun', { className: 'icon-sun' }),
      createIcon('moon', { className: 'icon-moon' })
    ]
  );

  const mobileToggleBtn = el(
    'button',
    {
      id: 'mobile-toggle',
      className: 'mobile-nav-toggle',
      attrs: {
        type: 'button',
        'aria-label': 'Toggle navigation menu',
        'aria-expanded': 'false',
        'aria-controls': 'nav-menu'
      },
      on: {
        click: () => store.dispatch(actions.toggleMobileMenu())
      }
    },
    [createIcon('menu')]
  );

  const navInner = el('div', { className: 'container nav-container' }, [
    el('div', { className: 'nav-brand' }, [
      el('a', {
        className: 'nav-brand-link',
        attrs: { href: '#home', 'aria-label': profile.fullName }
      }, [
        el('span', {
          className: 'brand-monogram',
          text: profile.monogram,
          attrs: { 'aria-hidden': 'true' }
        }),
        el('span', { className: 'brand-text', text: profile.brandName })
      ])
    ]),
    menuList,
    el('div', { className: 'nav-actions' }, [
      themeToggleBtn,
      createButton({
        label: 'Hire Me',
        variant: 'secondary',
        size: 'sm',
        href: '#contact'
      }),
      mobileToggleBtn
    ])
  ]);

  container.appendChild(navInner);

  const unsubActive = store.select(
    selectors.getActiveSection,
    (activeId) => {
      for (const [id, linkEl] of linkElements.entries()) {
        linkEl.classList.toggle('active', id === activeId);
        if (id === activeId) {
          linkEl.setAttribute('aria-current', 'page');
        } else {
          linkEl.removeAttribute('aria-current');
        }
      }
    },
    { emitImmediate: true }
  );

  const unsubScrolled = store.select(
    selectors.isNavbarScrolled,
    (scrolled) => container.classList.toggle('scrolled', scrolled),
    { emitImmediate: true }
  );

  const unsubMenu = store.select(
    selectors.isMobileMenuOpen,
    (isOpen) => {
      menuList.classList.toggle('open', isOpen);
      mobileToggleBtn.setAttribute('aria-expanded', String(isOpen));
    },
    { emitImmediate: true }
  );

  return () => {
    unsubActive();
    unsubScrolled();
    unsubMenu();
  };
}

