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
 * @returns {value is Error & { code: string }}
 */
export function isErrorWithCode (value) {
  return value instanceof Error && 'code' in value;
}

/**
 * @param {unknown} value
 * @returns {value is NodeJS.ErrnoException & { code: string, path: string }}
 */
export function looksLikeAnErrnoException (value) {
  return isErrorWithCode(value) && 'path' in value;
}
