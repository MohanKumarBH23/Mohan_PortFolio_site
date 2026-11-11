import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { createPortfolioStore } from '../src/state/store.js';
import { actions } from '../src/state/actions.js';
import { selectors } from '../src/state/selectors.js';
import { AppError } from '../src/core/errors.js';

describe('Centralized State Store', () => {
  it('initializes with default state slices and updates theme cleanly', () => {
    const store = createPortfolioStore({ initialTheme: 'dark' });
    assert.equal(selectors.getTheme(store.getState()), 'dark');

    store.dispatch(actions.setTheme('light', 'user'));
    assert.equal(selectors.getTheme(store.getState()), 'light');
    assert.equal(selectors.getThemeSource(store.getState()), 'user');
  });

  it('notifies slice selectors only when the selected slice changes', () => {
    const store = createPortfolioStore();
    let themeCalls = 0;
    let navCalls = 0;

    store.select(selectors.getTheme, () => themeCalls++);
    store.select(selectors.getActiveSection, () => navCalls++);

    store.dispatch(actions.setActiveSection('projects'));
    assert.equal(navCalls, 1);
    assert.equal(themeCalls, 0);

    // Dispatching same value should not trigger subscriber
    store.dispatch(actions.setActiveSection('projects'));
    assert.equal(navCalls, 1);
  });

  it('manages modal, contact, and toast state transitions immutably', () => {
    const store = createPortfolioStore();
    const initialRef = store.getState();

    store.dispatch(actions.openProjectModal('intelli-eye', 'btn-1'));
    assert.equal(selectors.getActiveModal(store.getState()).projectId, 'intelli-eye');
    assert.notEqual(store.getState(), initialRef);

    store.dispatch(actions.closeModal());
    assert.equal(selectors.getActiveModal(store.getState()), null);

    store.dispatch(actions.addToast({ id: 't1', message: 'Saved', variant: 'success' }));
    assert.equal(selectors.getToasts(store.getState()).length, 1);
    store.dispatch(actions.removeToast('t1'));
    assert.equal(selectors.getToasts(store.getState()).length, 0);
  });

  it('rejects malformed actions and isolates failing subscribers', () => {
    const logged = [];
    const store = createPortfolioStore({
      logger: {
        error: (msg, meta) => logged.push({ msg, meta })
      }
    });

    assert.throws(() => store.dispatch({}), AppError);

    let healthyCalls = 0;
    store.subscribe(() => {
      throw new Error('Subscriber exploded');
    });
    store.subscribe(() => {
      healthyCalls++;
    });

    store.dispatch(actions.setScrolled(true));
    assert.equal(healthyCalls, 1);
    assert.equal(logged.length, 1);
  });
});

