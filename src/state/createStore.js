/**
 * @fileoverview Lightweight Reactive Centralized Store Engine.
 * Implements predictable unidirectional state transitions (`dispatch -> reducer -> subscribe`),
 * middleware pipeline support, error-isolated listener execution, and fine-grained slice selectors.
 */

import { AppError } from '../core/errors.js';

/**
 * Creates a reactive state container.
 *
 * @template S
 * @param {(state: S, action: { type: string, payload?: unknown }) => S} reducer
 * @param {S} initialState
 * @param {object} [options]
 * @param {Array<(storeApi: object) => (next: Function) => (action: object) => unknown>} [options.middlewares=[]]
 * @param {{ error: Function }} [options.logger]
 * @returns {object} Store API (`getState`, `dispatch`, `subscribe`, `select`, `getListenerCount`).
 */
export function createStore(reducer, initialState, { middlewares = [], logger } = {}) {
  if (typeof reducer !== 'function') {
    throw new AppError('Store reducer must be a function.', { code: 'STORE_INIT_ERROR' });
  }

  let currentState = reducer(initialState, { type: '@@INIT' });
  let isDispatching = false;
  const listeners = new Set();

  function getState() {
    return currentState;
  }

  function baseDispatch(action) {
    if (!action || typeof action !== 'object' || typeof action.type !== 'string' || !action.type) {
      throw new AppError('Dispatched action must be an object with a non-empty string "type".', {
        code: 'INVALID_ACTION',
        details: { action }
      });
    }

    if (isDispatching) {
      throw new AppError(`Reducers may not dispatch actions while handling "${action.type}".`, {
        code: 'CONCURRENT_DISPATCH'
      });
    }

    const prevState = currentState;
    try {
      isDispatching = true;
      currentState = reducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    if (!Object.is(prevState, currentState)) {
      for (const listener of Array.from(listeners)) {
        try {
          listener(currentState, prevState, action);
        } catch (err) {
          logger?.error('Store subscriber threw an uncaught error', {
            actionType: action.type,
            error: err?.message || String(err)
          });
        }
      }
    }

    return action;
  }

  // Compose middlewares right-to-left around baseDispatch
  const middlewareApi = {
    getState,
    dispatch: (action) => dispatch(action)
  };

  let dispatch = baseDispatch;
  if (middlewares.length > 0) {
    const chain = middlewares.map((mw) => mw(middlewareApi));
    dispatch = chain.reduceRight((next, mw) => mw(next), baseDispatch);
  }

  /**
   * Registers a full-state change listener.
   *
   * @param {(nextState: S, prevState: S, action: object) => void} listener
   * @returns {() => void} Unsubscribe callback.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new AppError('Store subscriber must be a function.', { code: 'INVALID_SUBSCRIBER' });
    }
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  /**
   * Subscribes to a specific state slice and only fires when the selected value changes.
   *
   * @template T
   * @param {(state: S) => T} selector
   * @param {(nextSlice: T, prevSlice: T | undefined) => void} listener
   * @param {object} [options]
   * @param {(a: T, b: T) => boolean} [options.equalityFn=Object.is]
   * @param {boolean} [options.emitImmediate=false]
   * @returns {() => void} Unsubscribe callback.
   */
  function select(selector, listener, { equalityFn = Object.is, emitImmediate = false } = {}) {
    let lastSlice = selector(currentState);
    if (emitImmediate) {
      listener(lastSlice, undefined);
    }

    return subscribe((nextState) => {
      const nextSlice = selector(nextState);
      if (!equalityFn(lastSlice, nextSlice)) {
        const prevSlice = lastSlice;
        lastSlice = nextSlice;
        listener(nextSlice, prevSlice);
      }
    });
  }

  return Object.freeze({
    getState,
    dispatch,
    subscribe,
    select,
    getListenerCount: () => listeners.size
  });
}

/**
 * Built-in store logger middleware for development observability.
 *
 * @param {{ debug: Function }} logger
 */
export function createStoreLoggerMiddleware(logger) {
  return (storeApi) => (next) => (action) => {
    const prev = storeApi.getState();
    const result = next(action);
    const nextState = storeApi.getState();
    logger?.debug(`Action ${action.type}`, {
      payload: action.payload,
      changed: !Object.is(prev, nextState)
    });
    return result;
  };
}

