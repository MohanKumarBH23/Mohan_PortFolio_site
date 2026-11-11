/**
 * @fileoverview Portfolio Application Bootstrap & Composition Root.
 * Wires environment config, logging, error boundaries, API repositories,
 * pure business services, centralized reactive store, and modular UI components.
 */

import { getAppConfig } from './config/env.js';
import { createLogger } from './core/logger.js';
import { installGlobalErrorHandlers, normalizeError } from './core/errors.js';
import { createStorageService } from './core/storage.js';
import { assertElement, qs, qsa, safeRender } from './core/dom.js';

import { ApiClient } from './api/client.js';
import { createEndpoints } from './api/endpoints.js';
import { createContactRepository } from './api/repositories/contactRepository.js';

import { createContactService } from './services/contactService.js';
import { createThemeService } from './services/themeService.js';
import { createProjectService } from './services/projectService.js';
import { createClipboardService } from './services/clipboardService.js';
import { isNavbarScrolled, resolveActiveSection } from './services/navigationService.js';

import { createPortfolioStore } from './state/store.js';
import { actions } from './state/actions.js';
import { selectors } from './state/selectors.js';

import { NAV_ITEMS, PROFILE, CONTACT_CHANNELS, TIMELINE } from './data/profile.js';
import { SKILL_DOMAINS } from './data/skills.js';
import { PUBLICATIONS } from './data/publications.js';
import { PROJECTS } from './data/projects.js';

import { createToastNotifier, mountToastContainer } from './components/ui/ToastContainer.js';
import { mountNavbar } from './components/sections/Navbar.js';
import { renderHeroSection } from './components/sections/HeroSection.js';
import { renderAboutSection } from './components/sections/AboutSection.js';
import { renderSkillsSection } from './components/sections/SkillsSection.js';
import { renderPublicationsSection } from './components/sections/PublicationsSection.js';
import { renderProjectsSection } from './components/sections/ProjectsSection.js';
import { mountProjectDetailModal } from './components/sections/ProjectDetailModal.js';
import { mountPdfViewerModal } from './components/sections/PdfViewerModal.js';
import { renderTimelineSection } from './components/sections/TimelineSection.js';
import { mountContactSection } from './components/sections/ContactSection.js';
import { renderFooter } from './components/sections/Footer.js';

/**
 * Synchronizes the resolved theme onto `documentElement` and `<meta name="theme-color">`.
 *
 * @param {string} theme
 * @param {object} themeService
 */
function applyThemeToDocument(theme, themeService) {
  const meta = themeService.getThemeMetadata(theme);
  document.documentElement.setAttribute('data-theme', meta.theme);
  const metaTag = qs('meta[name="theme-color"]');
  if (metaTag && meta.themeColor) {
    metaTag.setAttribute('content', meta.themeColor);
  }
}

/**
 * Installs passive scroll-spy listener updating navigation slice in store.
 *
 * @param {object} store
 * @returns {() => void} Cleanup function.
 */
function bindScrollNavigation(store) {
  let ticking = false;

  const updateNavigationState = () => {
    ticking = false;
    const scrollY = window.scrollY || 0;
    store.dispatch(actions.setScrolled(isNavbarScrolled(scrollY)));

    const sectionElements = qsa('main header[id], main section[id]');
    const measurements = sectionElements.map((sec) => {
      const rect = sec.getBoundingClientRect();
      return {
        id: sec.getAttribute('id'),
        top: rect.top + scrollY,
        bottom: rect.bottom + scrollY
      };
    });

    const activeId = resolveActiveSection({ scrollY, sections: measurements });
    store.dispatch(actions.setActiveSection(activeId));
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateNavigationState);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  updateNavigationState();

  return () => {
    window.removeEventListener('scroll', onScroll);
  };
}

/**
 * Initializes the full portfolio application.
 *
 * @returns {() => void} Teardown callback.
 */
export function bootstrapApp() {
  const config = getAppConfig();
  const logger = createLogger({
    level: config.observability.logLevel,
    namespace: 'Portfolio'
  });

  const storage = createStorageService({ logger: logger.child('Storage') });

  // Build API client, endpoint catalog & repository
  const apiClient = new ApiClient({
    baseUrl: config.api.baseUrl,
    timeoutMs: config.api.timeoutMs,
    maxRetries: config.api.maxRetries,
    retryDelayMs: config.api.retryDelayMs,
    logger: logger.child('ApiClient')
  });

  const endpoints = createEndpoints(config);
  const contactRepository = createContactRepository({
    apiClient,
    endpoints,
    logger: logger.child('ContactRepository')
  });

  // Build pure business logic services
  const themeService = createThemeService({
    config,
    storage,
    prefersLightQuery: () =>
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: light)').matches
  });

  const contactService = createContactService({
    config,
    storage,
    contactRepository,
    logger: logger.child('ContactService')
  });

  const projectService = createProjectService(PROJECTS);
  const clipboardService = createClipboardService({ logger: logger.child('Clipboard') });

  // Initialize centralized state store
  const initialThemeInfo = themeService.resolveInitialTheme();
  const initialCooldown = contactService.getCooldownStatus();

  const store = createPortfolioStore({
    config,
    logger,
    initialTheme: initialThemeInfo.theme,
    themeSource: initialThemeInfo.source,
    inquiryHistory: contactService.getHistory(),
    cooldownUntil: initialCooldown.cooldownUntil
  });

  const notify = createToastNotifier(store);

  // Install global error boundary
  const uninstallGlobalErrors = installGlobalErrorHandlers({
    logger: logger.child('Boundary'),
    onError: (appErr) => {
      if (appErr.isOperational) {
        notify(appErr.message, 'error');
      }
    }
  });

  // Keep DOM theme attributes synchronized with store
  const unsubTheme = store.select(
    selectors.getTheme,
    (theme) => applyThemeToDocument(theme, themeService),
    { emitImmediate: true }
  );

  const handleToggleTheme = () => {
    const nextTheme = themeService.getNextTheme(selectors.getTheme(store.getState()));
    themeService.persistTheme(nextTheme);
    store.dispatch(actions.setTheme(nextTheme, 'user'));
    const meta = themeService.getThemeMetadata(nextTheme);
    notify(`Switched to ${meta.label}`, 'info');
  };

  // Mount UI components with per-section error boundaries
  const cleanups = [uninstallGlobalErrors, unsubTheme];

  safeRender(assertElement('#toast-root', 'ToastContainer'), (root) => {
    cleanups.push(mountToastContainer(root, store));
  }, { logger, sectionName: 'Notifications' });

  safeRender(assertElement('#navbar', 'Navbar'), (el) => {
    cleanups.push(
      mountNavbar(el, {
        store,
        profile: PROFILE,
        navItems: NAV_ITEMS,
        onToggleTheme: handleToggleTheme
      })
    );
  }, { logger, sectionName: 'Navigation' });

  safeRender(assertElement('#home', 'HeroSection'), (el) => {
    renderHeroSection(el, { profile: PROFILE });
  }, { logger, sectionName: 'Hero' });

  safeRender(assertElement('#about', 'AboutSection'), (el) => {
    renderAboutSection(el, { profile: PROFILE });
  }, { logger, sectionName: 'About' });

  safeRender(assertElement('#skills', 'SkillsSection'), (el) => {
    renderSkillsSection(el, { domains: SKILL_DOMAINS });
  }, { logger, sectionName: 'Technical Matrix' });

  safeRender(assertElement('#publications', 'PublicationsSection'), (el) => {
    renderPublicationsSection(el, { publications: PUBLICATIONS, store });
  }, { logger, sectionName: 'Publications' });

  safeRender(assertElement('#projects', 'ProjectsSection'), (el) => {
    renderProjectsSection(el, { projectService, store });
  }, { logger, sectionName: 'Projects' });

  safeRender(assertElement('#experience', 'TimelineSection'), (el) => {
    renderTimelineSection(el, { timeline: TIMELINE });
  }, { logger, sectionName: 'Timeline' });

  safeRender(assertElement('#contact', 'ContactSection'), (el) => {
    cleanups.push(
      mountContactSection(el, {
        channels: CONTACT_CHANNELS,
        recipientEmail: config.contactRecipientEmail,
        store,
        contactService,
        clipboardService,
        notify
      })
    );
  }, { logger, sectionName: 'Contact' });

  safeRender(assertElement('#footer', 'Footer'), (el) => {
    renderFooter(el, { profile: PROFILE, navItems: NAV_ITEMS });
  }, { logger, sectionName: 'Footer' });

  safeRender(assertElement('#project-modal-backdrop', 'ProjectDetailModal'), (el) => {
    cleanups.push(mountProjectDetailModal(el, { store, projectService, logger, notify }));
  }, { logger, sectionName: 'Project Details Modal' });

  safeRender(assertElement('#pdf-modal-backdrop', 'PdfViewerModal'), (el) => {
    cleanups.push(mountPdfViewerModal(el, { store, logger }));
  }, { logger, sectionName: 'PDF Viewer Modal' });

  // Global keyboard Escape handler (modals + mobile menu)
  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (selectors.getActiveModal(store.getState())) {
        store.dispatch(actions.closeModal());
      }
      if (selectors.isMobileMenuOpen(store.getState())) {
        store.dispatch(actions.closeMobileMenu());
      }
    }
  };
  document.addEventListener('keydown', onKeyDown);
  cleanups.push(() => document.removeEventListener('keydown', onKeyDown));

  cleanups.push(bindScrollNavigation(store));

  logger.info(`${config.appName} v${config.appVersion} booted in "${config.env}" mode.`);

  return () => {
    for (const cleanup of cleanups) {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    }
  };
}

function start() {
  try {
    bootstrapApp();
  } catch (err) {
    const normalized = normalizeError(err, 'Portfolio failed to initialize.');
    console.error('[Portfolio] Fatal bootstrap error:', normalized.toJSON());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}

