/**
 * @fileoverview Pure State Selectors decoupling UI components from raw state structure.
 */

export const selectors = Object.freeze({
  getTheme: (state) => state.theme.current,
  getThemeSource: (state) => state.theme.source,

  getNavigation: (state) => state.navigation,
  getActiveSection: (state) => state.navigation.activeSection,
  isNavbarScrolled: (state) => state.navigation.isScrolled,
  isMobileMenuOpen: (state) => state.navigation.isMobileMenuOpen,

  getActiveModal: (state) => state.modal.active,
  getModalTriggerId: (state) => state.modal.triggerElementId,

  getContactState: (state) => state.contact,
  isContactSubmitting: (state) => state.contact.status === 'submitting',

  getToasts: (state) => state.toasts.items
});

