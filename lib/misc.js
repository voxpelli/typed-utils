/**
 * @param {unknown} value
 * @returns {import('@voxpelli/type-helpers').LiteralTypeOf<*>}
 */
function _explainVariable (value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * @template T
 * @param {T} value
 * @returns {import('@voxpelli/type-helpers').LiteralTypeOf<T>}
 */
export function explainVariable (value) {
  return /** @type {import('@voxpelli/type-helpers').LiteralTypeOf<T>} */ (_explainVariable(value));
}

/**
 * @param {unknown} value
 * @returns {value is NodeJS.ErrnoException}
 */
export function looksLikeAnErrnoException (value) {
  return value instanceof Error && 'code' in value && 'path' in value;
}
