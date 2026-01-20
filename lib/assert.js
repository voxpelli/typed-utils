import { typesafeIsArray } from './array.js';
import { isOptionalKeyWithType, isType } from './is.js';
import { explainVariable } from './misc.js';

/** @import { LiteralTypes } from '@voxpelli/type-helpers' */

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
 * @returns {asserts obj is object}
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
