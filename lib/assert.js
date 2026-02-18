import { typesafeIsArray, typesafeIsReadonlyArray } from './array.js';
import { isOptionalKeyWithType, isType } from './is.js';
import { explainVariable } from './misc.js';
import { getObjectValueByPath, getValueByPath } from './object-path.js';

/** @import { LiteralTypes } from './types/literal-types.d.ts' */

export class TypeHelpersAssertionError extends Error {
  /**
   * @param {string} message
   * @param {{ stackStartFn?: (...args: any[]) => any }} [options]
   */
  constructor (message, { stackStartFn } = {}) {
    super(message);

    /** @type {string} */
    this.name = 'TypeHelpersAssertionError';

    // @ts-ignore No types for this outside of Node.js
    if (Error.captureStackTrace) {
      // @ts-ignore No types for this outside of Node.js
      Error.captureStackTrace(this, stackStartFn || TypeHelpersAssertionError);
    }
  }
}

/**
 * @param {boolean} condition
 * @param {string} message
 * @returns {asserts condition}
 */
export function assert (condition, message) {
  if (!condition) {
    throw new TypeHelpersAssertionError(message, { stackStartFn: assert });
  }
}

/**
 * @param {unknown} obj
 * @returns {asserts obj is LiteralTypes['object']}
 */
export function assertObject (obj) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeHelpersAssertionError(`Expected an object, but got: ${explainVariable(obj)}`);
  }
}

/**
 * @template {string} K
 * @param {unknown} obj
 * @param {K} key
 * @returns {asserts obj is Record<K, unknown>}
 */
export function assertObjectWithKey (obj, key) {
  assertObject(obj);

  if (!(key in obj)) {
    throw new TypeHelpersAssertionError(`Expected key "${key}" to exist in object`);
  }
}

/**
 * @template {keyof LiteralTypes} T
 * @param {unknown} value
 * @param {T} type
 * @param {string} [message]
 * @returns {asserts value is LiteralTypes[T]}
 */
export function assertType (value, type, message) {
  assert(
    isType(value, type),
    (message || `Expected type "${type}", but got:`) + ' ' + explainVariable(value)
  );
}

/**
 * @template {string} K
 * @template {keyof LiteralTypes} T
 * @param {unknown} obj
 * @param {K} key
 * @param {T} type
 * @returns {asserts obj is Record<K, LiteralTypes[T]>}
 */
export function assertKeyWithType (obj, key, type) {
  assertObjectWithKey(obj, key);

  assertType(
    obj[key],
    type,
    `Expected key "${key}" to have type "${type}", but got:`
  );
}

/**
 * @template {string} K
 * @template {keyof LiteralTypes} T
 * @param {unknown} obj
 * @param {K} key
 * @param {T} type
 * @returns {asserts obj is Partial<Record<K, LiteralTypes[T]>>}
 */
export function assertOptionalKeyWithType (obj, key, type) {
  assertObject(obj);

  if (!isOptionalKeyWithType(obj, key, type)) {
    assertObjectWithKey(obj, key);

    throw new TypeHelpersAssertionError(`Expected existing key "${key}" to be undefined or have type "${type}", but got: ${explainVariable(obj[key])}`);
  }
}

/**
 * @template {keyof LiteralTypes} T
 * @param {unknown} value
 * @param {T} type
 * @param {string} [message]
 * @returns {asserts value is Array<LiteralTypes[T]>}
 */
export function assertArrayOfLiteralType (value, type, message) {
  for (const item of typesafeIsArray(value) ? value : []) {
    assertType(item, type, message);
  }
}

/**
 * @template {keyof LiteralTypes} T
 * @param {unknown} obj
 * @param {T} type
 * @returns {asserts obj is Record<string, LiteralTypes[T]>}
 */
export function assertObjectValueType (obj, type) {
  assertObject(obj);

  assertArrayOfLiteralType(
    Object.values(obj),
    type,
    `Expected object values to have type "${type}", but got:`
  );

  assertArrayOfLiteralType(
    Object.keys(obj),
    'string',
    'Expected object keys to be string, but got:'
  );
}

/**
 * @template T
 * @param {T} obj
 * @param {string[]|readonly string[]|string} path
 * @returns {asserts obj is import('./types/path-types.d.ts').PathAssertedSimple<T>}
 */
export function assertObjectWithPath (obj, path) {
  const result = getObjectValueByPath(obj, path);

  if (!result || typeof result !== 'object') {
    const pathStr = typesafeIsReadonlyArray(path) ? path.join('.') : path;
    throw new TypeHelpersAssertionError(`Expected path "${pathStr}" to exist and be an object, but got: ${explainVariable(result)}`);
  }
}

/**
 * @template T
 * @template {keyof LiteralTypes} K
 * @param {T} obj
 * @param {string[]|readonly string[]|string} path
 * @param {K} type
 * @returns {asserts obj is import('./types/path-types.d.ts').PathAssertedSimple<T>}
 */
export function assertPathWithType (obj, path, type) {
  const result = getValueByPath(obj, path);

  if (typeof result !== 'object' || !result) {
    const pathStr = typesafeIsReadonlyArray(path) ? path.join('.') : path;
    throw new TypeHelpersAssertionError(`Expected path "${pathStr}" to exist, but got: ${explainVariable(result)}`);
  }

  assertType(
    result.value,
    type,
    `Expected path "${typesafeIsReadonlyArray(path) ? path.join('.') : path}" to have type "${type}", but got:`
  );
}

/**
 * @template T
 * @param {T} obj
 * @param {string[]|readonly string[]|string} path
 * @param {unknown} expectedValue
 * @returns {asserts obj is import('./types/path-types.d.ts').PathAssertedSimple<T>}
 */
export function assertPathWithValue (obj, path, expectedValue) {
  const result = getValueByPath(obj, path);

  if (typeof result !== 'object' || !result) {
    const pathStr = typesafeIsReadonlyArray(path) ? path.join('.') : path;
    throw new TypeHelpersAssertionError(`Expected path "${pathStr}" to exist, but got: ${explainVariable(result)}`);
  }

  if (result.value !== expectedValue) {
    const pathStr = typesafeIsReadonlyArray(path) ? path.join('.') : path;
    // Use JSON.stringify for better representation of values
    const expectedStr = typeof expectedValue === 'string' ? `"${expectedValue}"` : String(expectedValue);
    const actualStr = typeof result.value === 'string' ? `"${result.value}"` : String(result.value);
    throw new TypeHelpersAssertionError(`Expected path "${pathStr}" to have value ${expectedStr}, but got: ${actualStr}`);
  }
}
