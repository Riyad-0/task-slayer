import { createContext } from "react";

export const GuestIdContext = createContext(/** @type {string | null} */ (null));

/**
 * 
 * @returns {string}
 */
export function generateSessionId() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
}