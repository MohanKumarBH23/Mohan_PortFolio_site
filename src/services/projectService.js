/**
 * @fileoverview Project Domain Business Logic Service.
 * Provides validated lookup, grouping, and filtering across the portfolio projects catalog.
 */

import { NotFoundError } from '../core/errors.js';

/**
 * Creates a ProjectService backed by the provided project dataset.
 *
 * @param {Array<object>} projectsData
 */
export function createProjectService(projectsData = []) {
  const catalog = Array.isArray(projectsData) ? projectsData : [];
  const indexById = new Map(catalog.map((project) => [project.id, project]));

  return Object.freeze({
    /**
     * Returns all projects in display order.
     *
     * @returns {Array<object>}
     */
    getAllProjects() {
      return [...catalog];
    },

    /**
     * Returns the primary featured flagship project.
     *
     * @returns {object | null}
     */
    getFeaturedProject() {
      return catalog.find((p) => p.featured) || null;
    },

    /**
     * Returns secondary grid projects.
     *
     * @returns {Array<object>}
     */
    getSecondaryProjects() {
      return catalog.filter((p) => !p.featured);
    },

    /**
     * Finds a project by ID or returns null.
     *
     * @param {string} id
     * @returns {object | null}
     */
    findProjectById(id) {
      return indexById.get(id) || null;
    },

    /**
     * Resolves a project by ID or throws `NotFoundError`.
     *
     * @param {string} id
     * @returns {object}
     * @throws {NotFoundError}
     */
    getProjectById(id) {
      const found = indexById.get(id);
      if (!found) {
        throw new NotFoundError('Project', String(id));
      }
      return found;
    },

    /**
     * Filters projects by domain category (`'all'` returns every project).
     *
     * @param {string} category
     * @returns {Array<object>}
     */
    filterByCategory(category = 'all') {
      if (!category || category === 'all') {
        return [...catalog];
      }
      return catalog.filter((p) => p.categoryKey === category);
    }
  });
}

