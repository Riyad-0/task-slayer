import data from "./data";
/** @import { Guest, Session, User } from "./types" */

/**
 * @param {string} sessionId
 * @returns {Promise<User | undefined>}
 */
export async function getUserBySessionId(sessionId) {
  return (await data.getUsers()).find(user => user.session.id === sessionId);
}

/** @returns {Promise<Guest>} */
export async function generateGuest() {
  return {
    session: await createSession(),
    class_: "Scholar",
    hp: 10,
    xp: 0,
    monsters: [
      // {
      //   name: "Dust Golem",
      //   task: "fold the mountain",
      //   level: 8,
      //   currentHp: 5,
      //   maxHp: 10,
      // },
      // {
      //   name: "Caffeine Wraith",
      //   task: "no coffee after 2pm",
      //   level: "boss",
      //   currentHp: 1,
      //   maxHp: 1,
      // },
    ]
  }
}

/**
 * @param {string} id
 * @returns {Promise<Guest>}
 */
export async function generateGuestWithId(id) {
  return {
    session: await createSessionWithId(id),
    class_: "Scholar",
    hp: 10,
    xp: 0,
    monsters: [
      // {
      //   name: "Dust Golem",
      //   task: "fold the mountain",
      //   level: 8,
      //   currentHp: 5,
      //   maxHp: 10,
      // },
      // {
      //   name: "Caffeine Wraith",
      //   task: "no coffee after 2pm",
      //   level: "boss",
      //   currentHp: 1,
      //   maxHp: 1,
      // },
    ]
  }
}

/** @returns {Promise<Session>} */
async function createSession() {
  return {
    id: await generateSessionId(),
    created: Date.now(),
  };
}

/**
 * @param {string} id
 * @returns {Promise<Session>}
 */
async function createSessionWithId(id) {
  return {
    id,
    created: Date.now(),
  };
}

async function generateSessionId() {
  while (true) {
    const generatedCookie = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
    const isCookieInUse = (await data.getUsers()).some(user =>
      user.session.id === generatedCookie
    );
    if (!isCookieInUse) {
      return generatedCookie;
    }
  }
}

export default generateSessionId;