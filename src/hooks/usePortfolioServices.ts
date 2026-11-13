import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAppConfig } from '../config/env.js';
import { createLogger } from '../core/logger.js';
import { createStorageService } from '../core/storage.js';
import { createEndpoints } from '../api/endpoints.js';
import { ApiClient } from '../api/client.js';
import { createContactRepository } from '../api/repositories/contactRepository.js';
import { createContactService } from '../services/contactService.js';
import { createProjectService } from '../services/projectService.js';
import { createClipboardService } from '../services/clipboardService.js';
import { resolveActiveSection } from '../services/navigationService.js';
import { NAV_ITEMS, PROFILE } from '../data/profile.js';
import { PROJECTS } from '../data/projects.js';

export type ProjectCategory = 'all' | 'vision' | 'llm' | 'ai' | 'ml' | 'algo';

export type ThemeMode = 'light' | 'dark';

export interface ToastState {
  id: number;
  message: string;
  tone: 'default' | 'error';
}

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

/**
 * Instantiates application services, manages shared navigation & filter state,
 * handles light/dark theme toggling, and bridges domain services into React UI.
 */
export function usePortfolioServices() {
  const services = useMemo(() => {
    const config = getAppConfig() as Record<string, any>;
    const logger = createLogger({
      level: config.observability?.logLevel || 'info',
      namespace: 'Portfolio'
    }) as Record<string, any>;
    const storage = createStorageService({ logger: logger.child('Storage') });
    const endpoints = createEndpoints(config);
    const apiClient = new ApiClient({
      baseUrl: config.api?.baseUrl || '',
      timeoutMs: config.api?.timeoutMs || 8000,
      maxRetries: config.api?.maxRetries ?? 2,
      retryDelayMs: config.api?.retryDelayMs ?? 500,
      logger: logger.child('ApiClient')
    });
    const contactRepository = createContactRepository({
      apiClient,
      endpoints,
      logger: logger.child('ContactRepo')
    });
    const contactService = createContactService({
      config,
      storage,
      contactRepository,
      logger: logger.child('ContactService')
    }) as Record<string, any>;
    const projectService = createProjectService([...PROJECTS]) as Record<string, any>;
    const clipboardService = createClipboardService({
      logger: logger.child('Clipboard')
    }) as Record<string, any>;

    return {
      config,
      logger,
      contactService,
      projectService,
      clipboardService
    };
  }, []);

  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [pdfDocument, setPdfDocument] = useState<{
    url: string;
    title: string;
    downloadName: string;
    badgeLabel?: string;
  } | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mohan_theme_mode');
      if (stored === 'dark' || stored === 'light') return stored as ThemeMode;
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  const setTheme = useCallback((nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
        root.style.colorScheme = 'light';
      }
      localStorage.setItem('mohan_theme_mode', nextTheme);
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', nextTheme === 'dark' ? '#08090C' : '#F8F5E8');
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const showToast = useCallback((message: string, tone: 'default' | 'error' = 'default') => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    const id = Date.now();
    setToast({ id, message, tone });
    toastTimerRef.current = window.setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3400);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast(null);
  }, []);

  useEffect(() => {
    const updateActive = () => {
      const sections = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return {
          id: id as string,
          top: el.offsetTop,
          bottom: el.offsetTop + el.offsetHeight
        };
      }).filter((item): item is { id: string; top: number; bottom: number } => item !== null);

      if (sections.length > 0) {
        const current = resolveActiveSection({
          scrollY: window.scrollY,
          sections
        });
        if (current) {
          setActiveSection(current);
        }
      }
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const filteredProjects = useMemo(
    () => services.projectService.filterByCategory(selectedCategory),
    [services.projectService, selectedCategory]
  );

  const activeProject = useMemo(
    () => (activeProjectId ? services.projectService.findProjectById(activeProjectId) : null),
    [services.projectService, activeProjectId]
  );

  const openResumeModal = useCallback(() => {
    setPdfDocument({
      url: PROFILE.resume.url,
      title: `${PROFILE.fullName} — Curriculum Vitae`,
      downloadName: PROFILE.resume.downloadName,
      badgeLabel: 'CV · 2026'
    });
  }, []);

  const openPdfDocument = useCallback(
    (doc: { url: string; title: string; downloadName: string; badgeLabel?: string }) => {
      setPdfDocument(doc);
    },
    []
  );

  const closePdfDocument = useCallback(() => {
    setPdfDocument(null);
  }, []);

  const copyChannelValue = useCallback(
    async (value: string, successMessage: string) => {
      try {
        const res = await services.clipboardService.copyText(value);
        if (res?.copied) {
          showToast(successMessage, 'default');
        } else {
          showToast('Copy unavailable — value highlighted in channel.', 'error');
        }
      } catch {
        showToast('Unable to copy to clipboard.', 'error');
      }
    },
    [services.clipboardService, showToast]
  );

  return {
    ...services,
    theme,
    setTheme,
    toggleTheme,
    activeSection,
    selectedCategory,
    setSelectedCategory,
    filteredProjects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    pdfDocument,
    openResumeModal,
    openPdfDocument,
    closePdfDocument,
    toast,
    showToast,
    dismissToast,
    copyChannelValue
  };
}
