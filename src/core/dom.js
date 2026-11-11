/**
 * @fileoverview Safe DOM Query, Element Builder & Component Error Boundary Helpers.
 */

import { AppError, normalizeError } from './errors.js';

/**
 * Safely queries a single element within `root`.
 *
 * @param {string} selector
 * @param {ParentNode} [root=document]
 * @returns {Element | null}
 */
export function qs(selector, root = document) {
  if (!root || typeof root.querySelector !== 'function') return null;
  return root.querySelector(selector);
}

/**
 * Safely queries all matching elements as a standard Array.
 *
 * @param {string} selector
 * @param {ParentNode} [root=document]
 * @returns {Element[]}
 */
export function qsa(selector, root = document) {
  if (!root || typeof root.querySelectorAll !== 'function') return [];
  return Array.from(root.querySelectorAll(selector));
}

/**
 * Resolves a required DOM element or throws a structured `AppError`.
 *
 * @param {string | Element | null} target
 * @param {string} contextName
 * @returns {Element}
 * @throws {AppError}
 */
export function assertElement(target, contextName) {
  const element = typeof target === 'string' ? qs(target) : target;
  if (!element) {
    throw new AppError(`Required mount container not found for ${contextName}.`, {
      code: 'DOM_MOUNT_MISSING',
      statusCode: 500,
      details: { target: String(target), contextName }
    });
  }
  return element;
}

/**
 * Clears all child nodes of an element efficiently.
 *
 * @param {Element | null} element
 */
export function clearElement(element) {
  if (!element) return;
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Declarative DOM element builder that avoids raw HTML string injection.
 *
 * @param {string} tag
 * @param {object} [options]
 * @param {string} [options.className]
 * @param {string} [options.id]
 * @param {string} [options.text]
 * @param {Record<string, string | number | boolean | null | undefined>} [options.attrs]
 * @param {Record<string, string>} [options.dataset]
 * @param {Record<string, EventListener>} [options.on]
 * @param {Array<Node | string | null | undefined | false>} [children]
 * @returns {HTMLElement}
 */
export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);

  if (options.id) node.id = options.id;
  if (options.className) node.className = options.className;
  if (options.text !== undefined && options.text !== null) {
    node.textContent = String(options.text);
  }

  if (options.attrs) {
    for (const [key, val] of Object.entries(options.attrs)) {
      if (val === undefined || val === null || val === false) continue;
      if (val === true) {
        node.setAttribute(key, '');
      } else {
        node.setAttribute(key, String(val));
      }
    }
  }

  if (options.dataset) {
    for (const [key, val] of Object.entries(options.dataset)) {
      if (val !== undefined && val !== null) {
        node.dataset[key] = String(val);
      }
    }
  }

  if (options.on) {
    for (const [eventName, handler] of Object.entries(options.on)) {
      if (typeof handler === 'function') {
        node.addEventListener(eventName, handler);
      }
    }
  }

  appendChildren(node, children);
  return node;
}

/**
 * Appends nested arrays, strings, or DOM Nodes safely.
 *
 * @param {Node} parent
 * @param {Array<Node | string | null | undefined | false>} children
 */
export function appendChildren(parent, children = []) {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    if (Array.isArray(child)) {
      appendChildren(parent, child);
    } else if (typeof child === 'string' || typeof child === 'number') {
      parent.appendChild(document.createTextNode(String(child)));
    } else {
      parent.appendChild(child);
    }
  }
}

/**
 * Component Error Boundary wrapper: executes `renderFn` inside a `try/catch`
 * and renders a graceful fallback notice if rendering throws.
 *
 * @param {Element | null} container
 * @param {() => void} renderFn
 * @param {object} [options]
 * @param {{ error: Function }} [options.logger]
 * @param {string} [options.sectionName='Section']
 */
export function safeRender(container, renderFn, { logger, sectionName = 'Section' } = {}) {
  if (!container) {
    logger?.error(`Cannot render ${sectionName}: mount container is missing.`);
    return false;
  }

  try {
    renderFn(container);
    return true;
  } catch (err) {
    const normalized = normalizeError(err, `Failed to render ${sectionName}`);
    logger?.error(`Render failure in ${sectionName}`, normalized.toJSON());

    clearElement(container);
    const fallback = el('div', { className: 'container' }, [
      el('div', { className: 'error-boundary-card', attrs: { role: 'alert' } }, [
        el('strong', { text: `${sectionName} unavailable` }),
        el('p', {
          text: 'An unexpected rendering issue occurred while displaying this section. Please reload the page.'
        })
      ])
    ]);
    container.appendChild(fallback);
    return false;
  }
}

