/**
 * @fileoverview Pure Immutable State Reducers for all Application Slices.
 */

import { ActionTypes } from './actions.js';

/**
 * Builds the default initial application state tree.
 *
 * @param {object} [overrides]
 * @returns {object}
 */
export function createInitialState(overrides = {}) {
  return {
    theme: {
      current: overrides.initialTheme || 'dark',
      source: overrides.themeSource || 'default'
    },
    navigation: {
      activeSection: 'home',
      isScrolled: false,
      isMobileMenuOpen: false
    },
    modal: {
      active: null, // null | { type: 'project', projectId } | { type: 'pdf', title, src, downloadName, pdfStatus }
      triggerElementId: null
    },
    contact: {
      status: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
      fieldErrors: {},
      errorMessage: null,
      lastSubmission: null,
      failedRefId: null,
      cooldownUntil: overrides.cooldownUntil || 0,
      history: Array.isArray(overrides.inquiryHistory) ? overrides.inquiryHistory : []
    },
    toasts: {
      items: []
    }
  };
}

function themeReducer(state, action) {
  switch (action.type) {
    case ActionTypes.THEME_SET: {
      const { theme, source } = action.payload;
      if (state.current === theme && state.source === source) return state;
      return { current: theme, source };
    }
    default:
      return state;
  }
}

function navigationReducer(state, action) {
  switch (action.type) {
    case ActionTypes.NAV_SET_ACTIVE_SECTION:
      if (state.activeSection === action.payload) return state;
      return { ...state, activeSection: action.payload };
    case ActionTypes.NAV_SET_SCROLLED:
      if (state.isScrolled === action.payload) return state;
      return { ...state, isScrolled: action.payload };
    case ActionTypes.NAV_TOGGLE_MOBILE_MENU:
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen };
    case ActionTypes.NAV_CLOSE_MOBILE_MENU:
      if (!state.isMobileMenuOpen) return state;
      return { ...state, isMobileMenuOpen: false };
    default:
      return state;
  }
}

function modalReducer(state, action) {
  switch (action.type) {
    case ActionTypes.MODAL_OPEN_PROJECT:
      return {
        active: { type: 'project', projectId: action.payload.projectId },
        triggerElementId: action.payload.triggerElementId || null
      };
    case ActionTypes.MODAL_OPEN_PDF:
      return {
        active: {
          type: 'pdf',
          title: action.payload.title,
          src: action.payload.src,
          downloadName: action.payload.downloadName,
          pdfStatus: 'loading'
        },
        triggerElementId: action.payload.triggerElementId || null
      };
    case ActionTypes.MODAL_SET_PDF_STATUS:
      if (!state.active || state.active.type !== 'pdf' || state.active.pdfStatus === action.payload) {
        return state;
      }
      return {
        ...state,
        active: { ...state.active, pdfStatus: action.payload }
      };
    case ActionTypes.MODAL_CLOSE:
      if (!state.active) return state;
      return { active: null, triggerElementId: null };
    default:
      return state;
  }
}

function contactReducer(state, action) {
  switch (action.type) {
    case ActionTypes.CONTACT_START_SUBMIT:
      return {
        ...state,
        status: 'submitting',
        fieldErrors: {},
        errorMessage: null,
        failedRefId: null
      };
    case ActionTypes.CONTACT_VALIDATION_FAILED:
      return {
        ...state,
        status: 'error',
        fieldErrors: { ...action.payload.fieldErrors },
        errorMessage: action.payload.message,
        failedRefId: null
      };
    case ActionTypes.CONTACT_SUBMIT_SUCCESS:
      return {
        ...state,
        status: 'success',
        fieldErrors: {},
        errorMessage: null,
        failedRefId: null,
        lastSubmission: action.payload.submission,
        cooldownUntil: action.payload.cooldownUntil,
        history: [action.payload.submission, ...state.history].slice(0, 50)
      };
    case ActionTypes.CONTACT_SUBMIT_FAILURE:
      return {
        ...state,
        status: 'error',
        errorMessage: action.payload.message,
        failedRefId: action.payload.refId || null
      };
    case ActionTypes.CONTACT_CLEAR_FIELD_ERROR: {
      if (!state.fieldErrors[action.payload]) return state;
      const nextErrors = { ...state.fieldErrors };
      delete nextErrors[action.payload];
      return { ...state, fieldErrors: nextErrors };
    }
    case ActionTypes.CONTACT_RESET_STATUS:
      return {
        ...state,
        status: 'idle',
        fieldErrors: {},
        errorMessage: null,
        failedRefId: null
      };
    default:
      return state;
  }
}

function toastReducer(state, action) {
  switch (action.type) {
    case ActionTypes.TOAST_ADD:
      return {
        items: [...state.items.slice(-4), action.payload] // Keep max 5 active toasts
      };
    case ActionTypes.TOAST_MARK_LEAVING:
      return {
        items: state.items.map((item) =>
          item.id === action.payload ? { ...item, leaving: true } : item
        )
      };
    case ActionTypes.TOAST_REMOVE:
      return {
        items: state.items.filter((item) => item.id !== action.payload)
      };
    default:
      return state;
  }
}

/**
 * Root reducer combining all domain slices with structural sharing.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object}
 */
export function rootReducer(state, action) {
  const nextTheme = themeReducer(state.theme, action);
  const nextNavigation = navigationReducer(state.navigation, action);
  const nextModal = modalReducer(state.modal, action);
  const nextContact = contactReducer(state.contact, action);
  const nextToasts = toastReducer(state.toasts, action);

  if (
    nextTheme === state.theme &&
    nextNavigation === state.navigation &&
    nextModal === state.modal &&
    nextContact === state.contact &&
    nextToasts === state.toasts
  ) {
    return state;
  }

  return {
    theme: nextTheme,
    navigation: nextNavigation,
    modal: nextModal,
    contact: nextContact,
    toasts: nextToasts
  };
}

