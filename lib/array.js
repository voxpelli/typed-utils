/** @import { NonGenericString } from './types/string-types.d.ts' */

/**
 * @template {unknown[]|(readonly unknown[])} T
 * @template {undefined|null|false|string} [V=undefined]
 * @template {NonGenericString<V>} [R=NonGenericString<V>]
 * @param {T} input
 * @param {NonGenericString<V, 'Only accepting literal strings and undefined|null|false'>} [value]
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
 * Array.isArray() that also accepts readonly arrays in the type signature
 * Useful for functions that accept both mutable and readonly arrays
 *
 * @param {unknown} value
 * @returns {value is unknown[] | readonly unknown[]}
 */
export function typesafeIsReadonlyArray (value) {
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

/**
 * @template {Set<unknown> | Array<unknown> | ReadonlyArray<unknown>} C
 * @param {C} collection
 * @param {unknown} searchElement
 * @returns {searchElement is (C extends Iterable<infer U> ? U : never)}
 */
export function guardedArrayIncludes (collection, searchElement) {
  if (typesafeIsArray(collection)) {
    return collection.includes(searchElement);
  }

  if (!(collection instanceof Set)) {
    throw new TypeError('Invalid collection type');
  }

  return collection.has(searchElement);
}

/**
 * Convert a value to an array if it isn't already one.
 *
 * If `value` is already an array, returns it as-is. Otherwise, wraps `value`
 * in a new single-element array. Useful for normalizing inputs that may be
 * either a single item or an array of items.
 *
 * @template T
 * @param {T|T[]} value - Value to ensure is an array
 * @returns {T[]} The value as an array
 * @see {@link typesafeIsArray} - Used internally for type-safe array checking
 * @example
 * ```js
 * ensureArray('single'); // ['single']
 * ensureArray(['already', 'array']); // ['already', 'array']
 * ```
 */
export function ensureArray (value) {
  return typesafeIsArray(value) ? value : [value];
}
