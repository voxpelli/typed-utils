/* eslint-disable unicorn/no-null, unicorn/no-useless-undefined */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  assertArrayOfLiteralType,
  assert as assertHelper,
  assertKeyWithType,
  assertKeyWithValue,
  assertObject,
  assertObjectValueType,
  assertObjectWithKey,
  assertOptionalKeyWithType,
  assertStrictEqual,
  assertType,
  TypeHelpersAssertionEqualityError,
  TypeHelpersAssertionError,
} from '../lib/assert.js';

describe('assert', () => {
  describe('TypeHelpersAssertionError', () => {
    it('should be an Error instance', () => {
      const error = new TypeHelpersAssertionError('test');
      assert.ok(error instanceof Error);
      assert.strictEqual(error.name, 'TypeHelpersAssertionError');
      assert.strictEqual(error.message, 'test');
    });

    it('should capture stack trace', () => {
      const error = new TypeHelpersAssertionError('test');
      const { stack } = error;
      assert.ok(typeof stack === 'string');
      assert.match(stack, /TypeHelpersAssertionError/);
    });
  });

  describe('TypeHelpersAssertionEqualityError', () => {
    it('should be an Error instance with interoperable metadata fields', () => {
      const error = new TypeHelpersAssertionEqualityError(1, 2, 'strictEqual', 'test');

      assert.ok(error instanceof Error);
      assert.strictEqual(error.name, 'TypeHelpersAssertionEqualityError');
      assert.strictEqual(error.message, 'test');
      assert.strictEqual(error.actual, 1);
      assert.strictEqual(error.expected, 2);
      assert.strictEqual(error.operator, 'strictEqual');
      assert.strictEqual(error.diff, 'simple');
      assert.strictEqual(error.showDiff, true);
    });
  });

  describe('assert()', () => {
    it('should not throw when condition is true', () => {
      assert.doesNotThrow(() => assertHelper(true, 'should not throw'));
    });

    it('should throw TypeHelpersAssertionError when condition is false', () => {
      assert.throws(() => assertHelper(false, 'test message'), { name: 'TypeHelpersAssertionError', message: /test message/ });
    });
  });

  describe('assertStrictEqual()', () => {
    it('should not throw when values are strictly equal', () => {
      assert.doesNotThrow(() => assertStrictEqual('foo', 'foo'));
      assert.doesNotThrow(() => assertStrictEqual(123, 123));
    });

    it('should throw TypeHelpersAssertionEqualityError with expected metadata when unequal', () => {
      let thrownError;

      try {
        assertStrictEqual(1, 2);
      } catch (err) {
        thrownError = err;
      }

      assert.ok(thrownError instanceof TypeHelpersAssertionEqualityError);
      const equalityError = /** @type {TypeHelpersAssertionEqualityError} */ (thrownError);

      assert.strictEqual(equalityError.actual, 1);
      assert.strictEqual(equalityError.expected, 2);
      assert.strictEqual(equalityError.operator, 'strictEqual');
      assert.strictEqual(equalityError.diff, 'simple');
      assert.strictEqual(equalityError.showDiff, true);
      const { stack } = equalityError;
      assert.ok(typeof stack === 'string');
      assert.match(stack, /test\/assert\.spec\.js/);
    });

    it('should use provided custom message', () => {
      let thrownError;

      try {
        assertStrictEqual(1, 2, 'Custom message');
      } catch (err) {
        thrownError = err;
      }

      assert.ok(thrownError instanceof TypeHelpersAssertionEqualityError);
      const equalityError = /** @type {TypeHelpersAssertionEqualityError} */ (thrownError);

      assert.strictEqual(equalityError.message, 'Custom message');
    });
  });

  describe('assertObject()', () => {
    it('should not throw for valid objects', () => {
      assert.doesNotThrow(() => assertObject({}));
      assert.doesNotThrow(() => assertObject({ foo: 'bar' }));
      assert.doesNotThrow(() => assertObject([]));
    });

    it('should throw for non-objects', () => {
      assert.throws(() => assertObject(null), TypeHelpersAssertionError);
      assert.throws(() => assertObject(undefined), TypeHelpersAssertionError);
      assert.throws(() => assertObject('string'), TypeHelpersAssertionError);
      assert.throws(() => assertObject(123), TypeHelpersAssertionError);
    });
  });

  describe('assertObjectWithKey()', () => {
    it('should not throw when key exists', () => {
      assert.doesNotThrow(() => assertObjectWithKey({ foo: 'bar' }, 'foo'));
    });

    it('should throw when key does not exist', () => {
      assert.throws(() => assertObjectWithKey({ foo: 'bar' }, 'baz'), { name: 'TypeHelpersAssertionError', message: /Expected key "baz" to exist/ });
    });

    it('should throw when value is not an object', () => {
      assert.throws(() => assertObjectWithKey('string', 'foo'), { name: 'TypeHelpersAssertionError', message: /Expected an object/ });
    });
  });

  describe('assertType()', () => {
    it('should not throw for correct types', () => {
      assert.doesNotThrow(() => assertType('foo', 'string'));
      assert.doesNotThrow(() => assertType(123, 'number'));
      assert.doesNotThrow(() => assertType(true, 'boolean'));
      assert.doesNotThrow(() => assertType([], 'array'));
      assert.doesNotThrow(() => assertType({}, 'object'));
      assert.doesNotThrow(() => assertType(null, 'null'));
    });

    it('should throw for incorrect types', () => {
      assert.throws(() => assertType('foo', 'number'), { name: 'TypeHelpersAssertionError', message: /Expected type "number"/ });
      assert.throws(() => assertType(123, 'string'), { name: 'TypeHelpersAssertionError', message: /Expected type "string"/ });
    });

    it('should accept custom error message', () => {
      assert.throws(() => assertType('foo', 'number', 'Custom error'), { name: 'TypeHelpersAssertionError', message: /Custom error/ });
    });
  });

  describe('assertKeyWithType()', () => {
    it('should not throw when key exists with correct type', () => {
      assert.doesNotThrow(() => assertKeyWithType({ foo: 'bar' }, 'foo', 'string'));
      assert.doesNotThrow(() => assertKeyWithType({ num: 123 }, 'num', 'number'));
    });

    it('should throw when key does not exist', () => {
      assert.throws(() => assertKeyWithType({ foo: 'bar' }, 'baz', 'string'), { name: 'TypeHelpersAssertionError', message: /Expected key "baz" to exist/ });
    });

    it('should throw when key exists but has wrong type', () => {
      assert.throws(() => assertKeyWithType({ foo: 'bar' }, 'foo', 'number'), { name: 'TypeHelpersAssertionError', message: /Expected key "foo" to have type "number"/ });
    });
  });

  describe('assertKeyWithValue()', () => {
    it('should not throw when key exists with matching value', () => {
      assert.doesNotThrow(() => assertKeyWithValue({ foo: 'bar' }, 'foo', 'bar'));
      assert.doesNotThrow(() => assertKeyWithValue({ num: 123 }, 'num', 123));
    });

    it('should throw when key does not exist', () => {
      assert.throws(() => assertKeyWithValue({ foo: 'bar' }, 'baz', 'bar'), { name: 'TypeHelpersAssertionError', message: /Expected key "baz" to exist/ });
    });

    it('should throw when key exists but has wrong value', () => {
      assert.throws(() => assertKeyWithValue({ foo: 'bar' }, 'foo', 'baz'), (err) => err instanceof TypeHelpersAssertionError && err.message.includes('Expected key "foo" to be strictly equal to provided value'));
    });
  });

  describe('assertOptionalKeyWithType()', () => {
    it('should not throw when key does not exist', () => {
      assert.doesNotThrow(() => assertOptionalKeyWithType({ foo: 'bar' }, 'baz', 'string'));
    });

    it('should not throw when key is undefined', () => {
      assert.doesNotThrow(() => assertOptionalKeyWithType({ foo: undefined }, 'foo', 'string'));
    });

    it('should not throw when key exists with correct type', () => {
      assert.doesNotThrow(() => assertOptionalKeyWithType({ foo: 'bar' }, 'foo', 'string'));
    });

    it('should throw when key exists with wrong type', () => {
      assert.throws(() => assertOptionalKeyWithType({ foo: 123 }, 'foo', 'string'), { name: 'TypeHelpersAssertionError', message: /Expected existing key "foo" to be undefined or have type "string"/ });
    });

    it('should throw when value is not an object', () => {
      assert.throws(() => assertOptionalKeyWithType('string', 'foo', 'string'), { name: 'TypeHelpersAssertionError', message: /Expected an object/ });
    });
  });

  describe('assertArrayOfLiteralType()', () => {
    it('should not throw for arrays with all elements of correct type', () => {
      assert.doesNotThrow(() => assertArrayOfLiteralType(['foo', 'bar', 'baz'], 'string'));
      assert.doesNotThrow(() => assertArrayOfLiteralType([1, 2, 3], 'number'));
      assert.doesNotThrow(() => assertArrayOfLiteralType([true, false], 'boolean'));
      assert.doesNotThrow(() => assertArrayOfLiteralType([[], [1], [2, 3]], 'array'));
    });

    it('should not throw for empty arrays', () => {
      assert.doesNotThrow(() => assertArrayOfLiteralType([], 'string'));
      assert.doesNotThrow(() => assertArrayOfLiteralType([], 'number'));
    });

    it('should throw when array contains element of wrong type', () => {
      assert.throws(() => assertArrayOfLiteralType(['foo', 123, 'bar'], 'string'), { name: 'TypeHelpersAssertionError', message: /Expected type "string"/ });
      assert.throws(() => assertArrayOfLiteralType([1, 2, 'three'], 'number'), { name: 'TypeHelpersAssertionError', message: /Expected type "number"/ });
    });

    it('should accept custom error message', () => {
      assert.throws(() => assertArrayOfLiteralType(['foo', 123], 'string', 'Custom message'), { name: 'TypeHelpersAssertionError', message: /Custom message/ });
    });

    it('should handle non-array values gracefully', () => {
      // Non-arrays should not throw (iterates over empty array)
      assert.doesNotThrow(() => assertArrayOfLiteralType('not an array', 'string'));
      assert.doesNotThrow(() => assertArrayOfLiteralType(null, 'string'));
      assert.doesNotThrow(() => assertArrayOfLiteralType(undefined, 'string'));
    });
  });

  describe('assertArrayOfLiteralType() with array of types', () => {
    it('should not throw for arrays with elements matching any allowed type', () => {
      assert.doesNotThrow(() => assertArrayOfLiteralType(['foo', 123, 'bar'], ['string', 'number']));
      assert.doesNotThrow(() => assertArrayOfLiteralType([1, 'two', 3], ['string', 'number']));
      assert.doesNotThrow(() => assertArrayOfLiteralType([true, 42, 'test'], ['boolean', 'number', 'string']));
    });

    it('should not throw for empty arrays with array of types', () => {
      assert.doesNotThrow(() => assertArrayOfLiteralType([], ['string', 'number']));
    });

    it('should throw when array contains element not matching any allowed type', () => {
      assert.throws(() => assertArrayOfLiteralType(['foo', null], ['string', 'number']), { name: 'TypeHelpersAssertionError', message: /Expected type "string", "number"/ });
      assert.throws(() => assertArrayOfLiteralType([1, undefined], ['string', 'boolean']), TypeHelpersAssertionError);
    });

    it('should work with custom error message and array of types', () => {
      assert.throws(() => assertArrayOfLiteralType(['foo', null], ['string', 'number'], 'Custom message'), { name: 'TypeHelpersAssertionError', message: /Custom message/ });
    });
  });

  describe('assertObjectValueType()', () => {
    it('should not throw for objects with all values of correct type', () => {
      assert.doesNotThrow(() => assertObjectValueType({ a: 'foo', b: 'bar' }, 'string'));
      assert.doesNotThrow(() => assertObjectValueType({ x: 1, y: 2, z: 3 }, 'number'));
      assert.doesNotThrow(() => assertObjectValueType({ flag1: true, flag2: false }, 'boolean'));
    });

    it('should not throw for empty objects', () => {
      assert.doesNotThrow(() => assertObjectValueType({}, 'string'));
      assert.doesNotThrow(() => assertObjectValueType({}, 'number'));
    });

    it('should throw when object contains value of wrong type', () => {
      assert.throws(() => assertObjectValueType({ a: 'foo', b: 123 }, 'string'), { name: 'TypeHelpersAssertionError', message: /Expected object values to have type "string"/ });
      assert.throws(() => assertObjectValueType({ x: 1, y: 'two' }, 'number'), { name: 'TypeHelpersAssertionError', message: /Expected object values to have type "number"/ });
    });

    it('should throw when value is not an object', () => {
      assert.throws(() => assertObjectValueType('string', 'string'), { name: 'TypeHelpersAssertionError', message: /Expected an object/ });
      assert.throws(() => assertObjectValueType(null, 'string'), { name: 'TypeHelpersAssertionError', message: /Expected an object/ });
      assert.throws(() => assertObjectValueType(123, 'string'), { name: 'TypeHelpersAssertionError', message: /Expected an object/ });
    });

    it('should validate that all keys are strings', () => {
      const obj = { a: 'foo', b: 'bar' };
      assert.doesNotThrow(() => assertObjectValueType(obj, 'string'));
    });

    it('should not throw for objects with values of any allowed type (array)', () => {
      assert.doesNotThrow(() => assertObjectValueType({ a: 'foo', b: 123, c: true }, ['string', 'number', 'boolean']));
      assert.doesNotThrow(() => assertObjectValueType({ x: 1, y: 'two' }, ['string', 'number']));
      assert.doesNotThrow(() => assertObjectValueType({ flag: true, count: 42 }, ['boolean', 'number']));
    });

    it('should not throw for empty objects with array of types', () => {
      assert.doesNotThrow(() => assertObjectValueType({}, ['string', 'number']));
    });

    it('should throw when object contains value not matching any allowed type', () => {
      assert.throws(() => assertObjectValueType({ a: 'foo', b: null }, ['string', 'number']), { name: 'TypeHelpersAssertionError', message: /Expected object values to have type "string", "number"/ });
      assert.throws(() => assertObjectValueType({ x: 1, y: undefined }, ['string', 'boolean']), { name: 'TypeHelpersAssertionError', message: /Expected object values to have type "string", "boolean"/ });
    });
  });

  describe('assertKeyWithType() with array of types', () => {
    it('should not throw when value matches any allowed type', () => {
      assert.doesNotThrow(() => assertKeyWithType({ x: 'hello' }, 'x', ['string', 'number']));
      assert.doesNotThrow(() => assertKeyWithType({ x: 42 }, 'x', ['string', 'number']));
      assert.doesNotThrow(() => assertKeyWithType({ x: true }, 'x', ['boolean', 'number']));
    });

    it('should throw when value matches none of the allowed types', () => {
      assert.throws(() => assertKeyWithType({ x: true }, 'x', ['string', 'number']), { name: 'TypeHelpersAssertionError', message: /Expected key "x" to have type "string", "number"/ });
      assert.throws(() => assertKeyWithType({ x: 'hello' }, 'x', ['number', 'boolean']), { name: 'TypeHelpersAssertionError', message: /Expected key "x" to have type "number", "boolean"/ });
    });

    it('should throw when key does not exist', () => {
      assert.throws(() => assertKeyWithType({ y: 'hello' }, 'x', ['string', 'number']), { name: 'TypeHelpersAssertionError', message: /Expected key "x" to exist in object/ });
    });

    it('should throw when object is not an object', () => {
      assert.throws(() => assertKeyWithType(undefined, 'x', ['string', 'number']), { name: 'TypeHelpersAssertionError', message: /Expected an object/ });
      assert.throws(() => assertKeyWithType('not an object', 'x', ['string', 'number']), { name: 'TypeHelpersAssertionError', message: /Expected an object/ });
    });

    it('should work with single-element array', () => {
      assert.doesNotThrow(() => assertKeyWithType({ x: 'hello' }, 'x', ['string']));
      assert.throws(() => assertKeyWithType({ x: 42 }, 'x', ['string']), { name: 'TypeHelpersAssertionError', message: /Expected key "x" to have type "string"/ });
    });

    it('should work with null as an allowed type', () => {
      assert.doesNotThrow(() => assertKeyWithType({ x: null }, 'x', ['string', 'null']));
      assert.doesNotThrow(() => assertKeyWithType({ x: 'hello' }, 'x', ['string', 'null']));

      assert.throws(() => assertKeyWithType({ x: null }, 'x', ['number', 'boolean']), { name: 'TypeHelpersAssertionError', message: /Expected key "x" to have type "number", "boolean"/ });
    });
  });

  describe('assertOptionalKeyWithType() with array of types', () => {
    it('should not throw when key is absent', () => {
      assert.doesNotThrow(() => assertOptionalKeyWithType({ y: 'other' }, 'x', ['string', 'number']));
    });

    it('should not throw when key exists with value matching any allowed type', () => {
      assert.doesNotThrow(() => assertOptionalKeyWithType({ x: 'hello' }, 'x', ['string', 'number']));
      assert.doesNotThrow(() => assertOptionalKeyWithType({ x: 42 }, 'x', ['string', 'number']));
    });

    it('should not throw when key exists and is undefined', () => {
      assert.doesNotThrow(() => assertOptionalKeyWithType({ x: undefined }, 'x', ['string', 'number']));
    });

    it('should throw when key exists with value matching none of the allowed types', () => {
      assert.throws(() => assertOptionalKeyWithType({ x: true }, 'x', ['string', 'number']), { name: 'TypeHelpersAssertionError', message: /Expected existing key "x" to be undefined or have type "string", "number"/ });
      assert.throws(() => assertOptionalKeyWithType({ x: Symbol('sym') }, 'x', ['string', 'boolean']), { name: 'TypeHelpersAssertionError', message: /Expected existing key "x" to be undefined or have type "string", "boolean"/ });
    });

    it('should throw when object is not an object', () => {
      assert.throws(() => assertOptionalKeyWithType(undefined, 'x', ['string', 'number']), { name: 'TypeHelpersAssertionError', message: /Expected an object/ });
      assert.throws(() => assertOptionalKeyWithType('not an object', 'x', ['string', 'number']), { name: 'TypeHelpersAssertionError', message: /Expected an object/ });
    });

    it('should work with single-element array', () => {
      assert.doesNotThrow(() => assertOptionalKeyWithType({ x: 'hello' }, 'x', ['string']));
      assert.doesNotThrow(() => assertOptionalKeyWithType({ y: 'other' }, 'x', ['string']));
      assert.throws(() => assertOptionalKeyWithType({ x: 42 }, 'x', ['string']), { name: 'TypeHelpersAssertionError', message: /Expected existing key "x" to be undefined or have type "string"/ });
    });

    it('should work with null as an allowed type', () => {
      assert.doesNotThrow(() => assertOptionalKeyWithType({ x: null }, 'x', ['string', 'null']));
      assert.doesNotThrow(() => assertOptionalKeyWithType({ x: 'hello' }, 'x', ['string', 'null']));
      assert.doesNotThrow(() => assertOptionalKeyWithType({ y: 'other' }, 'x', ['string', 'null']));

      assert.throws(() => assertOptionalKeyWithType({ x: null }, 'x', ['number', 'boolean']), { name: 'TypeHelpersAssertionError', message: /Expected existing key "x" to be undefined or have type "number", "boolean"/ });
    });
  });
});
