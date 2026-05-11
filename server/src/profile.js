/** @import { Profile, User } from "./types" */

/**
 * @param {User} user
 * @returns {Profile}
 */
export function getProfile(user) {
  return {
    displayName: displayName(user),
    hp: user.hp,
    xp: user.xp,
    class_: user.class_,
    monsters: user.monsters,
  };
}

/**
 * @param {User} user
 * @returns {string}
 */
export function displayName(user) {
  return "Guest";
}