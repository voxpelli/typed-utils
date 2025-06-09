import assert from 'node:assert/strict';

import { isOptionalKeyWithType, isType } from './is.js';
import { explainVariable } from './misc.js';

/** @import { LiteralTypes } from '@voxpelli/type-helpers' */

/**
 * @param {unknown} obj
 * @returns {asserts obj is object}
 */
export function assertObject (obj) {
  if (!obj || typeof obj !== 'object') {
    assert.fail(`Expected an object, but got: ${explainVariable(obj)}`);
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
    assert.fail(`Expected key "${key}" to exist in object`);
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
  assert(isType(value, type), message || `Expected type "${type}", but got: ${explainVariable(value)}`);
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
  assertType(obj[key], type, `Expected key "${key}" to have type "${type}", but got: ${explainVariable(obj[key])}`);
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

    assert.fail(`Expected existing key "${key}" to be undefined or have type "${type}", but got: ${explainVariable(obj[key])}`);
  }
}
