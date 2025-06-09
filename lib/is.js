/** @typedef { import('@voxpelli/type-helpers').LiteralTypes } LiteralTypes */

/**
 * @template {string} K
 * @param {unknown} obj
 * @param {K} key
 * @returns {obj is Record<K, unknown>}
 */
export function isObjectWithKey (obj, key) {
  return !!(obj && typeof obj === 'object' && key in obj);
}

/**
 * @template {keyof LiteralTypes} T
 * @param {unknown} value
 * @param {T} type
 * @returns {value is LiteralTypes[T]}
 */
export function isType (value, type) {
  if (value === null) return type === 'null';
  if (Array.isArray(value)) return type === 'array';
  // eslint-disable-next-line valid-typeof
  return (typeof value) === type;
}

/**
 * @template {string} K
 * @template {keyof LiteralTypes} T
 * @param {unknown} obj
 * @param {K} key
 * @param {T} type
 * @returns {obj is Record<K, LiteralTypes[T]>}
 */
export function isKeyWithType (obj, key, type) {
  return (
    isObjectWithKey(obj, key) &&
    isType(obj[key], type)
  );
}

/**
 * @template {string} K
 * @template {keyof LiteralTypes} T
 * @param {unknown} obj
 * @param {K} key
 * @param {T} type
 * @returns {obj is Partial<Record<K, LiteralTypes[T]>>}
 */
export function isOptionalKeyWithType (obj, key, type) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const hasKey = isObjectWithKey(obj, key);

  if (!hasKey) {
    return true;
  }

  return (
    isType(obj[key], type) ||
    isType(obj[key], 'undefined')
  );
}
