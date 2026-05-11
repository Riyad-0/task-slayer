import { createContext } from "react";

const GuestContext = createContext(generateSessionId());

/**
 * 
 * @returns {string}
 */
function generateSessionId() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
}