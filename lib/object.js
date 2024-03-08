/**
 * @template {object} T
 * @template {keyof T} K
 * @param {T} input
 * @param {K[]|ReadonlyArray<K>} keys
 * @returns {Omit<T, K>}
 */
export function omit (input, keys) {
  const result = { ...input };

  for (const key of keys) {
    delete result[key];
  }

  return result;
}

/**
 * @template {object} T
 * @template {keyof T} K
 * @param {T} input
 * @param {K[]|ReadonlyArray<K>} keys
 * @returns {Pick<T, K>}
 */
export function pick (input, keys) {
  /** @type {Partial<Pick<T, K>>} */
  const result = {};

  for (const key of keys) {
    result[key] = input[key];
  }

  return /** @type {Pick<T, K>} */ (result);
}
