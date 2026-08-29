import { env } from '$env/dynamic/private';

/**
 * Server-only. Falls back to the current production API when API_BASE_URL
 * isn't set, so behavior is unchanged until an environment sets its own
 * value (see .env.example). Never import this module from client code.
 */
export const API_BASE_URL =
  env.API_BASE_URL || 'https://academic-project-management-api.onrender.com/api';

/**
 * El token real ya no se guarda aquí.
 * El token viene de la sesión creada en login y se inyecta desde hooks.server.js.
 */

export function getTokenByModule() {
  return '';
}

export function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
}

export function getUserEndpoint(_moduleName, userId = null) {
  if (!userId) {
    return null;
  }

  return `${API_BASE_URL}/users/${userId}`;
}