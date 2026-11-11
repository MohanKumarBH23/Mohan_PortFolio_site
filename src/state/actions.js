/**
 * @fileoverview Centralized Action Types & Action Creators for the Portfolio Store.
 */

export const ActionTypes = Object.freeze({
  // Theme actions
  THEME_SET: 'theme/set',

  // Navigation actions
  NAV_SET_ACTIVE_SECTION: 'navigation/setActiveSection',
  NAV_SET_SCROLLED: 'navigation/setScrolled',
  NAV_TOGGLE_MOBILE_MENU: 'navigation/toggleMobileMenu',
  NAV_CLOSE_MOBILE_MENU: 'navigation/closeMobileMenu',

  // Modal actions
  MODAL_OPEN_PROJECT: 'modal/openProject',
  MODAL_OPEN_PDF: 'modal/openPdf',
  MODAL_SET_PDF_STATUS: 'modal/setPdfStatus',
  MODAL_CLOSE: 'modal/close',

  // Contact form actions
  CONTACT_START_SUBMIT: 'contact/startSubmit',
  CONTACT_VALIDATION_FAILED: 'contact/validationFailed',
  CONTACT_SUBMIT_SUCCESS: 'contact/submitSuccess',
  CONTACT_SUBMIT_FAILURE: 'contact/submitFailure',
  CONTACT_CLEAR_FIELD_ERROR: 'contact/clearFieldError',
  CONTACT_RESET_STATUS: 'contact/resetStatus',

  // Toast notifications
  TOAST_ADD: 'toast/add',
  TOAST_MARK_LEAVING: 'toast/markLeaving',
  TOAST_REMOVE: 'toast/remove'
});

export const actions = Object.freeze({
  setTheme: (theme, source = 'user') => ({
    type: ActionTypes.THEME_SET,
    payload: { theme, source }
  }),

  setActiveSection: (sectionId) => ({
    type: ActionTypes.NAV_SET_ACTIVE_SECTION,
    payload: sectionId
  }),

  setScrolled: (isScrolled) => ({
    type: ActionTypes.NAV_SET_SCROLLED,
    payload: Boolean(isScrolled)
  }),

  toggleMobileMenu: () => ({
    type: ActionTypes.NAV_TOGGLE_MOBILE_MENU
  }),

  closeMobileMenu: () => ({
    type: ActionTypes.NAV_CLOSE_MOBILE_MENU
  }),

  openProjectModal: (projectId, triggerElementId = null) => ({
    type: ActionTypes.MODAL_OPEN_PROJECT,
    payload: { projectId, triggerElementId }
  }),

  openPdfModal: ({ title, src, downloadName, triggerElementId = null }) => ({
    type: ActionTypes.MODAL_OPEN_PDF,
    payload: { title, src, downloadName, triggerElementId }
  }),

  setPdfStatus: (status) => ({
    type: ActionTypes.MODAL_SET_PDF_STATUS,
    payload: status
  }),

  closeModal: () => ({
    type: ActionTypes.MODAL_CLOSE
  }),

  startContactSubmit: () => ({
    type: ActionTypes.CONTACT_START_SUBMIT
  }),

  contactValidationFailed: (fieldErrors, message) => ({
    type: ActionTypes.CONTACT_VALIDATION_FAILED,
    payload: { fieldErrors, message }
  }),

  contactSubmitSuccess: ({ submission, cooldownUntil }) => ({
    type: ActionTypes.CONTACT_SUBMIT_SUCCESS,
    payload: { submission, cooldownUntil }
  }),

  contactSubmitFailure: ({ message, refId = null }) => ({
    type: ActionTypes.CONTACT_SUBMIT_FAILURE,
    payload: { message, refId }
  }),

  clearContactFieldError: (fieldName) => ({
    type: ActionTypes.CONTACT_CLEAR_FIELD_ERROR,
    payload: fieldName
  }),

  resetContactStatus: () => ({
    type: ActionTypes.CONTACT_RESET_STATUS
  }),

  addToast: ({ id, message, variant = 'info' }) => ({
    type: ActionTypes.TOAST_ADD,
    payload: { id, message, variant, createdAt: Date.now(), leaving: false }
  }),

  markToastLeaving: (id) => ({
    type: ActionTypes.TOAST_MARK_LEAVING,
    payload: id
  }),

  removeToast: (id) => ({
    type: ActionTypes.TOAST_REMOVE,
    payload: id
  })
});

