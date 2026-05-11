/**
 * 
 * @param {string} path
 * @param {string | null} guestId
 * 
 */
export async function get(path, guestId) {
  const res = (guestId === null) ?
    await fetch(path) :
    await fetch(path, { headers: { 'X-Guest-Id': guestId } });
  return await res.json();
}

/**
 * 
 * @param {string} path
 * @param {string | null} guestId
 * @param {any} body 
 * 
 */
export async function post(path, guestId, body) {
  /** @type {HeadersInit} */
  const headers = {
    'Content-Type': 'application/json',
  };
  if (guestId !== null) {
    headers['X-Guest-Id'] = guestId;
  }
  await fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
}