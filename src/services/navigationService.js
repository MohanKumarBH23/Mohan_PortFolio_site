/**
 * @fileoverview Navigation & Scroll-Spy Pure Business Logic Service.
 */

/**
 * Determines whether the navbar has crossed the scrolled elevation threshold.
 *
 * @param {number} scrollY
 * @param {number} [threshold=20]
 * @returns {boolean}
 */
export function isNavbarScrolled(scrollY, threshold = 20) {
  return Number(scrollY) > threshold;
}

/**
 * Resolves the active navigation section given current scroll offset and section positions.
 * Pure deterministic function suitable for unit testing without browser APIs.
 *
 * @param {object} params
 * @param {number} params.scrollY
 * @param {Array<{ id: string, top: number, bottom: number }>} params.sections
 * @param {number} [params.topResetThreshold=120]
 * @param {number} [params.viewportFocusOffset=160]
 * @param {string} [params.defaultSection='home']
 * @returns {string}
 */
export function resolveActiveSection({
  scrollY,
  sections = [],
  topResetThreshold = 120,
  viewportFocusOffset = 160,
  defaultSection = 'home'
}) {
  if (scrollY < topResetThreshold || sections.length === 0) {
    return defaultSection;
  }

  const probeY = scrollY + viewportFocusOffset;
  let active = defaultSection;

  for (const sec of sections) {
    if (probeY >= sec.top) {
      active = sec.id;
    }
  }

  return active;
}

