/**
 * @template {unknown[]|(readonly unknown[])} T
 * @template {undefined|null|false} [V=undefined]
 * @param {T} input
 * @param {V} [value]
 * @returns {Exclude<T[number], V>[]}
 */
export function filter (input, value) {
  /** @type {Exclude<T[number], V>[]} */
  const result = [];

  for (const item of input) {
    if (item !== value) {
      result.push(/** @type {Exclude<T[number], V>} */ (item));
    }
  }

  return result;
}

/**
 * Array.isArray() on its own give type any[]
 *
 * @param {unknown} value
 * @returns {value is unknown[]}
 */
export function isUnknownArray (value) {
  return Array.isArray(value);
}

/**
 * @param {unknown} value
 * @returns {value is string[]}
 */
export function isStringArray (value) {
  if (!isUnknownArray(value)) return false;
  return value.every(item => typeof item === 'string');
}
