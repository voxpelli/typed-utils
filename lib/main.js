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
