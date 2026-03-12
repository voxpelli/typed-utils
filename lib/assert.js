import { typesafeIsArray } from './array.js';
import { isOptionalKeyWithType, isType } from './is.js';
import { explainVariable } from './misc.js';

/** @import { LiteralTypes } from './types/literal-types.d.ts' */

/** @typedef {((...args: any[]) => any) | (new (...args: any[]) => any)} StackStartFn */

export class TypeHelpersAssertionError extends Error {
  /**
   * @param {string} message
   * @param {{ stackStartFn?: StackStartFn | undefined }} [options]
   */
  constructor (message, { stackStartFn = TypeHelpersAssertionError } = {}) {
    super(message);

    /** @type {string} */
    this.name = 'TypeHelpersAssertionError';

    // @ts-ignore No types for this outside of Node.js
    if (Error.captureStackTrace) {
      // @ts-ignore No types for this outside of Node.js
      Error.captureStackTrace(this, stackStartFn);
    }
  }
}

/**
 * @template [Actual=unknown]
 * @template [Expected=unknown]
 * @template [Operator=string]
 * @see https://nodejs.org/api/assert.html#class-assertassertionerror
 * @see https://www.chaijs.com/api/assert/#method_strictequal
 * @see https://github.com/voxpelli/node-test-pretty-reporter#rendering-diffs-from-assertions
 */
export class TypeHelpersAssertionEqualityError extends TypeHelpersAssertionError {
  /** @type {Actual} */
  actual;

  /** @type {'simple' | 'full'} */
  diff;

  /** @type {Expected} */
  expected;

  /** @type {Operator} */
  operator;

  /** @type {boolean} */
  showDiff;

  /**
   * @param {Actual} actual
   * @param {Expected} expected
   * @param {Operator} operator
   * @param {string} message
   * @param {{
   *   diff?: 'simple' | 'full' | undefined,
   *   showDiff?: boolean | undefined,
   *   stackStartFn?: StackStartFn | undefined,
   * }} [options]
   */
  constructor (
    actual,
    expected,
    operator,
    message,
    {
      diff = 'simple',
      showDiff = true,
      stackStartFn = TypeHelpersAssertionEqualityError,
    } = {}
  ) {
    super(message, { stackStartFn });

    /** @type {string} */
    this.name = 'TypeHelpersAssertionEqualityError';

    this.actual = actual;
    this.diff = diff;
    this.expected = expected;
    this.operator = operator;
    this.showDiff = showDiff;
  }
}

/**
 * @param {boolean} condition
 * @param {string} message
 * @returns {asserts condition}
 */
export function assert (condition, message) {
  if (!condition) {
    throw new TypeHelpersAssertionError(message);
  }
}

/**
 * @template T
 * @param {unknown} actual
 * @param {T} expected
 * @param {string} [message]
 * @returns {asserts actual is T}
 * @see https://nodejs.org/api/assert.html#assertstrictequalactual-expected-message
 * @see https://www.chaijs.com/api/assert/#method_strictequal
 * @see https://www.npmjs.com/package/jest-diff
 */
export function assertStrictEqual (actual, expected, message = 'Expected values to be strictly equal') {
  if (actual !== expected) {
    throw new TypeHelpersAssertionEqualityError(actual, expected, 'strictEqual', message, {
      stackStartFn: assertStrictEqual,
    });
  }
}

/**
 * @param {unknown} obj
 * @returns {asserts obj is Record<string, unknown>}
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
 * @param {T | T[]} type
 * @param {string} [message]
 * @returns {asserts value is LiteralTypes[T]}
 */
export function assertType (value, type, message) {
  const types = typesafeIsArray(type) ? type : [type];

  assert(
    isType(value, type),
    (message || `Expected type "${types.join('", "')}", but got:`) + ' ' + explainVariable(value)
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
 * @template {string} K
 * @template T
 * @param {unknown} obj
 * @param {K} key
 * @param {T} value
 * @returns {asserts obj is Record<K, T>}
 */
export function assertKeyWithValue (obj, key, value) {
  assertObjectWithKey(obj, key);

  assertStrictEqual(obj[key], value, `Expected key "${key}" to be strictly equal to provided value`);
}

/**
 * @template {keyof LiteralTypes} T
 * @param {unknown} value
 * @param {T | T[]} type
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
 * @param {T | T[]} type
 * @returns {asserts obj is Record<string, LiteralTypes[T]>}
 */
export function assertObjectValueType (obj, type) {
  assertObject(obj);

  const types = typesafeIsArray(type) ? type : [type];

  assertArrayOfLiteralType(
    Object.values(obj),
    type,
    `Expected object values to have type "${types.join('", "')}", but got:`
  );

  assertArrayOfLiteralType(
    Object.keys(obj),
    'string',
    'Expected object keys to be string, but got:'
  );
}
