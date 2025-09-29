import { isPropertyKey } from './is.js';

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
 * @template {{}} T
 * @typedef {T extends unknown ? keyof T : never} ObjectKeysAll
 */

/**
 * @template {{}} T
 * @param {T} value
 * @returns {Array<keyof T>}
 */
export function typedObjectKeys (value) {
  return /** @type {Array<keyof T>} */ (Object.keys(value));
}

/**
 * @template {{}} T
 * @param {T} value
 * @returns {Array<ObjectKeysAll<T>>}
 */
export function typedObjectKeysAll (value) {
  return /** @type {Array<ObjectKeysAll<T>>} */ (Object.keys(value));
}

/**
 * @template {{}} T
 * @param {T} collection
 * @param {unknown} key
 * @returns {key is keyof T}
 */
export function hasOwn (collection, key) {
  return isPropertyKey(key) ? Object.hasOwn(collection, key) : false;
}

/**
 * @template {{}} T
 * @param {T} collection
 * @param {unknown} key
 * @returns {key is ObjectKeysAll<T>}
 */
export function hasOwnAll (collection, key) {
  return hasOwn(collection, key);
}
