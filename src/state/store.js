/**
 * @fileoverview Configured Portfolio Store Factory.
 */

import { createStore, createStoreLoggerMiddleware } from './createStore.js';
import { createInitialState, rootReducer } from './reducers.js';

/**
 * Instantiates a fully configured portfolio store.
 *
 * @param {object} [options]
 * @param {object} [options.config]
 * @param {object} [options.logger]
 * @param {string} [options.initialTheme='dark']
 * @param {string} [options.themeSource='default']
 * @param {Array} [options.inquiryHistory=[]]
 * @param {number} [options.cooldownUntil=0]
 * @returns {object} Reactive store instance.
 */
export function createPortfolioStore({
  config,
  logger,
  initialTheme = 'dark',
  themeSource = 'default',
  inquiryHistory = [],
  cooldownUntil = 0
} = {}) {
  const middlewares = [];
  if (config?.observability?.enableStoreLogger && logger) {
    middlewares.push(createStoreLoggerMiddleware(logger.child('Store')));
  }

  const initialState = createInitialState({
    initialTheme,
    themeSource,
    inquiryHistory,
    cooldownUntil
  });

  return createStore(rootReducer, initialState, { middlewares, logger });
}

