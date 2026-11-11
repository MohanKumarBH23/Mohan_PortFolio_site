/**
 * @fileoverview Synchronous Pre-Paint Theme Initializer.
 * Executes immediately in `<head>` before first render to prevent Flash of Unstyled Content (FOUC),
 * reading configuration keys from `window.__PORTFOLIO_RUNTIME_ENV__` without duplicating constants.
 */
(function initThemePrePaint() {
  var runtimeEnv = typeof globalThis !== 'undefined' ? globalThis.__PORTFOLIO_RUNTIME_ENV__ : null;
  var storageKey = (runtimeEnv && runtimeEnv.storage && runtimeEnv.storage.themeKey) || 'mohan_theme';
  var defaultTheme = (runtimeEnv && runtimeEnv.theme && runtimeEnv.theme.defaultTheme) || 'dark';
  var themesMap = (runtimeEnv && runtimeEnv.theme && runtimeEnv.theme.themes) || {
    dark: { themeColor: '#121110' },
    light: { themeColor: '#FAF7F2' }
  };

  var theme = defaultTheme;
  try {
    var saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') {
      theme = saved;
    } else if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      theme = 'light';
    }
  } catch {
    theme = defaultTheme;
  }

  document.documentElement.setAttribute('data-theme', theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta && themesMap[theme] && themesMap[theme].themeColor) {
    meta.setAttribute('content', themesMap[theme].themeColor);
  }
})();

