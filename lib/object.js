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
    if (key in input) {
      result[key] = input[key];
    }
  }

  return /** @type {Pick<T, K>} */ (result);
}

/**
 * @template {{ [key: string]: unknown }} T
 * @param {T} value
 * @returns {Array<keyof T>}
 */
export function typedObjectKeys (value) {
  return Object.keys(value);
}

/**
 * @template {{ [key: string]: unknown }} T
 * @param {T} value
 * @returns {Array<T extends unknown ? keyof T : never>}
 */
export function typedObjectKeysAll (value) {
  return /** @type {Array<T extends unknown ? keyof T : never>} */ (Object.keys(value));
}
