/**
 * @template {unknown[]|(readonly unknown[])} T
 * @template {undefined|null|false|string} [V=undefined]
 * @template {import('@voxpelli/type-helpers').NonGenericString<V>} [R=import('@voxpelli/type-helpers').NonGenericString<V>]
 * @param {T} input
 * @param {import('@voxpelli/type-helpers').NonGenericString<V, 'Only accepting literal strings and undefined|null|false'>} [value]
 * @returns {Exclude<T[number], R>[]}
 */
export function filter (input, value) {
  /** @type {Exclude<T[number], R>[]} */
  const result = [];

  for (const item of input) {
    if (item !== value) {
      result.push(/** @type {Exclude<T[number], R>} */ (item));
    }
  }

  return result;
}

/**
 * @template {unknown[]|(readonly unknown[])} T
 * @template R
 * @param {T} input
 * @param {(value: T[number]) => value is R} callback
 * @returns {R[]}
 */
export function filterWithCallback (input, callback) {
  /** @type {R[]} */
  const result = [];

  for (const item of input) {
    if (callback(item)) {
      result.push(item);
    }
  }

  return result;
}

/**
 * @template {(value: unknown) => value is any} CB
 * @param {unknown} value
 * @param {CB} callback
 * @returns {value is Array<CB extends ((value: unknown) => value is infer U) ? U : never>}
 */
export function isArrayOfType (value, callback) {
  if (!typesafeIsArray(value)) return false;
  return value.every(item => callback(item));
}

/**
 * Array.isArray() on its own give type any[]
 *
 * @deprecated Use typesafeIsArray() instead
 * @param {unknown} value
 * @returns {value is unknown[]}
 */
export function isUnknownArray (value) {
  return Array.isArray(value);
}

/**
 * Array.isArray() on its own give type any[]
 *
 * @param {unknown} value
 * @returns {value is unknown[]}
 */
export function typesafeIsArray (value) {
  return Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {value is string[]}
 */
export function isStringArray (value) {
  if (!typesafeIsArray(value)) return false;
  return value.every(item => typeof item === 'string');
}
