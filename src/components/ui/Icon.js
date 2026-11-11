/**
 * @fileoverview Centralized SVG Icon Registry Component.
 * Eliminates duplicated inline SVGs across HTML and components using safe SVG DOM creation.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

const ICON_DEFINITIONS = {
  sun: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    nodes: [
      ['path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
      }]
    ]
  },
  moon: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    nodes: [
      ['path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
      }]
    ]
  },
  menu: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    nodes: [
      ['path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M4 6h16M4 12h16m-7 6h7'
      }]
    ]
  },
  arrowRight: {
    viewBox: '0 0 14 14',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['path', { d: 'M1 7h12M8 2l5 5-5 5' }]
    ]
  },
  download: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
      ['polyline', { points: '7 10 12 15 17 10' }],
      ['line', { x1: '12', y1: '15', x2: '12', y2: '3' }]
    ]
  },
  document: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }],
      ['polyline', { points: '14 2 14 8 20 8' }],
      ['line', { x1: '16', y1: '13', x2: '8', y2: '13' }],
      ['line', { x1: '16', y1: '17', x2: '8', y2: '17' }]
    ]
  },
  externalLink: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }],
      ['polyline', { points: '15 3 21 3 21 9' }],
      ['line', { x1: '10', y1: '14', x2: '21', y2: '3' }]
    ]
  },
  github: {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    nodes: [
      ['path', {
        d: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z'
      }]
    ]
  },
  linkedin: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' }],
      ['rect', { x: '2', y: '9', width: '4', height: '12' }],
      ['circle', { cx: '4', cy: '4', r: '2' }]
    ]
  },
  phone: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['path', {
        d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'
      }]
    ]
  },
  mail: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['path', { d: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' }],
      ['polyline', { points: '22,6 12,13 2,6' }]
    ]
  },
  copy: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['rect', { x: '9', y: '9', width: '13', height: '13', rx: '2', ry: '2' }],
      ['path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }]
    ]
  },
  book: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }],
      ['path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' }]
    ]
  },
  layers: {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    nodes: [
      ['path', { d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' }]
    ]
  },
  gear: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['circle', { cx: '12', cy: '12', r: '3' }],
      ['path', {
        d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'
      }]
    ]
  },
  chart: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['path', { d: 'M12 2a10 10 0 1 0 10 10H12V2z' }],
      ['path', { d: 'M12 12L2.5 7.5' }],
      ['path', { d: 'M12 12V22' }]
    ]
  },
  browser: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['rect', { x: '3', y: '4', width: '18', height: '16', rx: '2' }],
      ['line', { x1: '3', y1: '9', x2: '21', y2: '9' }],
      ['line', { x1: '9', y1: '20', x2: '9', y2: '9' }]
    ]
  },
  network: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['circle', { cx: '5', cy: '6', r: '2.5' }],
      ['circle', { cx: '5', cy: '18', r: '2.5' }],
      ['circle', { cx: '19', cy: '12', r: '2.5' }],
      ['line', { x1: '7.3', y1: '7', x2: '16.7', y2: '11' }],
      ['line', { x1: '7.3', y1: '17', x2: '16.7', y2: '13' }]
    ]
  },
  code: {
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    nodes: [
      ['polyline', { points: '16 18 22 12 16 6' }],
      ['polyline', { points: '8 6 2 12 8 18' }]
    ]
  }
};

/**
 * Builds an accessible SVG icon element from the centralized registry.
 *
 * @param {keyof typeof ICON_DEFINITIONS} name
 * @param {object} [options]
 * @param {number} [options.size]
 * @param {string} [options.className]
 * @returns {SVGSVGElement}
 */
export function createIcon(name, { size, className } = {}) {
  const def = ICON_DEFINITIONS[name];
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');

  if (!def) {
    svg.setAttribute('viewBox', '0 0 24 24');
    return svg;
  }

  svg.setAttribute('viewBox', def.viewBox);
  if (size) {
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
  }
  if (className) {
    svg.setAttribute('class', className);
  }
  if (def.fill) svg.setAttribute('fill', def.fill);
  if (def.stroke) svg.setAttribute('stroke', def.stroke);
  if (def.strokeWidth) svg.setAttribute('stroke-width', def.strokeWidth);

  for (const [nodeTag, attrs] of def.nodes) {
    const child = document.createElementNS(SVG_NS, nodeTag);
    for (const [k, v] of Object.entries(attrs)) {
      child.setAttribute(k, v);
    }
    svg.appendChild(child);
  }

  return svg;
}

