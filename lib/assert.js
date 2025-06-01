import assert from 'node:assert/strict';

import { isType } from './is.js';
import { explainVariable } from './misc.js';

/** @import { LiteralTypes } from '@voxpelli/type-helpers' */

/**
 * @template {string} K
 * @param {unknown} obj
 * @param {K} key
 * @returns {asserts obj is Record<K, unknown>}
 */
export function assertObjectWithKey (obj, key) {
  if (!obj || typeof obj !== 'object') {
    assert.fail(`Expected an object, but got: ${explainVariable(obj)}`);
  }

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
