/**
 * @typedef {object} Profile
 * @property {string} displayName
 * @property {number} hp
 * @property {number} xp
 * @property {Class} class_
 * @property {Monster[]} monsters
 */

/**
 * @typedef {Guest} User
 */

/**
 * @typedef {object} Guest
 * @property {Session} session
 * @property {number} hp
 * @property {number} xp
 * @property {Class} class_
 * @property {Monster[]} monsters
 */

/**
 * @typedef {object} Session
 * @property {string} id
 * @property {number} created - The result of Date.now() when the session was created.
 */

/**
 * @typedef {classes[number]} Class
 */

/**
 * @typedef {object} Monster
 * @property {number} id
 * @property {string} taskName
 * @property {MonsterKind} kind
 * @property {string} task
 * @property {Level} level
 * @property {number} currentHp
 * @property {number} maxHp
 * @property {string} frequencyMagnitude
 * @property {FrequencyUnit} frequencyUnit
 * @property {number | null} deadline // In milliseconds; null if frequencyMagnitude is invalid.
 */

/**
 * @typedef {frequencyUnits[number]} FrequencyUnit
 */

/**
 * 
 * @typedef {monsterKinds[number]} MonsterKind 
 */

/**
 * @typedef {number | "boss"} Level
 */

/**
 * @exports {User}
 */

const classes = /** @type {const} */ (["Warrior", "Scholar", "Bard", "Monk"]);

export const monsterKinds = /** @type {const} */ ([
  "Demon",
  "Dragon",
  "Cyclops",
  "Goblin",
  "Golem",
  "Gorgon",
  "Hydra",
  "Kraken",
  "Mummy",
  "Serpent",
  "Skeleton",
  "Vampire",
  "Werewolf",
  "Witch",
  "Wraith",
  "Zombie",
]);

export const frequencyUnits = /** @type {const} */ ([
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "year",
]);

/**
 * 
 * @param {any} class_ 
 * @returns {class_ is Class}
 */
export function isClass(class_) {
  return classes.includes(class_);
}
