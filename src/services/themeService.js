/**
 * @fileoverview Theme Business Logic Service.
 * Manages theme resolution, toggle transitions, metadata lookup, and persistence.
 */

const VALID_THEMES = new Set(['dark', 'light']);

/**
 * Creates a ThemeService instance.
 *
 * @param {object} deps
 * @param {Readonly<object>} deps.config
 * @param {object} deps.storage
 * @param {() => boolean} [deps.prefersLightQuery] - Optional OS color-scheme resolver.
 */
export function createThemeService({ config, storage, prefersLightQuery } = {}) {
  const themeKey = config.storage.themeKey;
  const defaultTheme = VALID_THEMES.has(config.theme?.defaultTheme)
    ? config.theme.defaultTheme
    : 'dark';
  const themeMetaMap = config.theme?.themes || {
    dark: { label: 'Dark Mineral Lacquer', themeColor: '#121110' },
    light: { label: 'Navy & Cream (Coral)', themeColor: '#FAF7F2' }
  };

  function isValidTheme(theme) {
    return VALID_THEMES.has(theme);
  }

  function resolveInitialTheme() {
    const saved = storage.getString(themeKey, null);
    if (isValidTheme(saved)) {
      return { theme: saved, source: 'storage' };
    }

    if (typeof prefersLightQuery === 'function' && prefersLightQuery()) {
      return { theme: 'light', source: 'system' };
    }

    return { theme: defaultTheme, source: 'default' };
  }

  function getNextTheme(currentTheme) {
    return currentTheme === 'light' ? 'dark' : 'light';
  }

  function getThemeMetadata(theme) {
    const normalized = isValidTheme(theme) ? theme : defaultTheme;
    const meta = themeMetaMap[normalized] || themeMetaMap[defaultTheme];
    return {
      theme: normalized,
      label: meta.label,
      themeColor: meta.themeColor
    };
  }

  function persistTheme(theme) {
    if (!isValidTheme(theme)) return false;
    return storage.setString(themeKey, theme);
  }

  return Object.freeze({
    isValidTheme,
    resolveInitialTheme,
    getNextTheme,
    getThemeMetadata,
    persistTheme
  });
}

