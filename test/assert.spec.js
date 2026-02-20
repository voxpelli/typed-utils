/* eslint-disable unicorn/no-null, unicorn/no-useless-undefined */
import { describe, it } from 'mocha';
import chai from 'chai';

import {
  assert,
  assertArrayOfLiteralType,
  assertObject,
  assertObjectValueType,
  assertObjectWithKey,
  assertKeyWithType,
  assertOptionalKeyWithType,
  assertType,
  TypeHelpersAssertionError,
} from '../lib/assert.js';

const { expect } = chai;

describe('assert', () => {
  describe('TypeHelpersAssertionError', () => {
    it('should be an Error instance', () => {
      const error = new TypeHelpersAssertionError('test');
      expect(error).to.be.instanceOf(Error);
      expect(error.name).to.equal('TypeHelpersAssertionError');
      expect(error.message).to.equal('test');
    });

    it('should capture stack trace', () => {
      const error = new TypeHelpersAssertionError('test');
      expect(error.stack).to.be.a('string');
      expect(error.stack).to.include('TypeHelpersAssertionError');
    });
  });

  describe('assert()', () => {
    it('should not throw when condition is true', () => {
      expect(() => assert(true, 'should not throw')).to.not.throw();
    });

    it('should throw TypeHelpersAssertionError when condition is false', () => {
      expect(() => assert(false, 'test message')).to.throw(TypeHelpersAssertionError, 'test message');
    });
  });

  describe('assertObject()', () => {
    it('should not throw for valid objects', () => {
      expect(() => assertObject({})).to.not.throw();
      expect(() => assertObject({ foo: 'bar' })).to.not.throw();
      expect(() => assertObject([])).to.not.throw();
    });

    it('should throw for non-objects', () => {
      expect(() => assertObject(null)).to.throw(TypeHelpersAssertionError);
      expect(() => assertObject(undefined)).to.throw(TypeHelpersAssertionError);
      expect(() => assertObject('string')).to.throw(TypeHelpersAssertionError);
      expect(() => assertObject(123)).to.throw(TypeHelpersAssertionError);
    });
  });

  describe('assertObjectWithKey()', () => {
    it('should not throw when key exists', () => {
      expect(() => assertObjectWithKey({ foo: 'bar' }, 'foo')).to.not.throw();
    });

    it('should throw when key does not exist', () => {
      expect(() => assertObjectWithKey({ foo: 'bar' }, 'baz')).to.throw(TypeHelpersAssertionError, 'Expected key "baz" to exist');
    });

    it('should throw when value is not an object', () => {
      expect(() => assertObjectWithKey('string', 'foo')).to.throw(TypeHelpersAssertionError, 'Expected an object');
    });
  });

  describe('assertType()', () => {
    it('should not throw for correct types', () => {
      expect(() => assertType('foo', 'string')).to.not.throw();
      expect(() => assertType(123, 'number')).to.not.throw();
      expect(() => assertType(true, 'boolean')).to.not.throw();
      expect(() => assertType([], 'array')).to.not.throw();
      expect(() => assertType({}, 'object')).to.not.throw();
      expect(() => assertType(null, 'null')).to.not.throw();
    });

    it('should throw for incorrect types', () => {
      expect(() => assertType('foo', 'number')).to.throw(TypeHelpersAssertionError, 'Expected type "number"');
      expect(() => assertType(123, 'string')).to.throw(TypeHelpersAssertionError, 'Expected type "string"');
    });

    it('should accept custom error message', () => {
      expect(() => assertType('foo', 'number', 'Custom error')).to.throw(TypeHelpersAssertionError, 'Custom error');
    });
  });

  describe('assertKeyWithType()', () => {
    it('should not throw when key exists with correct type', () => {
      expect(() => assertKeyWithType({ foo: 'bar' }, 'foo', 'string')).to.not.throw();
      expect(() => assertKeyWithType({ num: 123 }, 'num', 'number')).to.not.throw();
    });

    it('should throw when key does not exist', () => {
      expect(() => assertKeyWithType({ foo: 'bar' }, 'baz', 'string')).to.throw(TypeHelpersAssertionError, 'Expected key "baz" to exist');
    });

    it('should throw when key exists but has wrong type', () => {
      expect(() => assertKeyWithType({ foo: 'bar' }, 'foo', 'number')).to.throw(TypeHelpersAssertionError, 'Expected key "foo" to have type "number"');
    });
  });

  describe('assertOptionalKeyWithType()', () => {
    it('should not throw when key does not exist', () => {
      expect(() => assertOptionalKeyWithType({ foo: 'bar' }, 'baz', 'string')).to.not.throw();
    });

    it('should not throw when key is undefined', () => {
      expect(() => assertOptionalKeyWithType({ foo: undefined }, 'foo', 'string')).to.not.throw();
    });

    it('should not throw when key exists with correct type', () => {
      expect(() => assertOptionalKeyWithType({ foo: 'bar' }, 'foo', 'string')).to.not.throw();
    });

    it('should throw when key exists with wrong type', () => {
      expect(() => assertOptionalKeyWithType({ foo: 123 }, 'foo', 'string')).to.throw(TypeHelpersAssertionError, 'Expected existing key "foo" to be undefined or have type "string"');
    });

    it('should throw when value is not an object', () => {
      expect(() => assertOptionalKeyWithType('string', 'foo', 'string')).to.throw(TypeHelpersAssertionError, 'Expected an object');
    });
  });

  describe('assertArrayOfLiteralType()', () => {
    it('should not throw for arrays with all elements of correct type', () => {
      expect(() => assertArrayOfLiteralType(['foo', 'bar', 'baz'], 'string')).to.not.throw();
      expect(() => assertArrayOfLiteralType([1, 2, 3], 'number')).to.not.throw();
      expect(() => assertArrayOfLiteralType([true, false], 'boolean')).to.not.throw();
      expect(() => assertArrayOfLiteralType([[], [1], [2, 3]], 'array')).to.not.throw();
    });

    it('should not throw for empty arrays', () => {
      expect(() => assertArrayOfLiteralType([], 'string')).to.not.throw();
      expect(() => assertArrayOfLiteralType([], 'number')).to.not.throw();
    });

    it('should throw when array contains element of wrong type', () => {
      expect(() => assertArrayOfLiteralType(['foo', 123, 'bar'], 'string')).to.throw(TypeHelpersAssertionError, 'Expected type "string"');
      expect(() => assertArrayOfLiteralType([1, 2, 'three'], 'number')).to.throw(TypeHelpersAssertionError, 'Expected type "number"');
    });

    it('should accept custom error message', () => {
      expect(() => assertArrayOfLiteralType(['foo', 123], 'string', 'Custom message')).to.throw(TypeHelpersAssertionError, 'Custom message');
    });

    it('should handle non-array values gracefully', () => {
      // Non-arrays should not throw (iterates over empty array)
      expect(() => assertArrayOfLiteralType('not an array', 'string')).to.not.throw();
      expect(() => assertArrayOfLiteralType(null, 'string')).to.not.throw();
      expect(() => assertArrayOfLiteralType(undefined, 'string')).to.not.throw();
    });
  });

  describe('assertArrayOfLiteralType() with array of types', () => {
    it('should not throw for arrays with elements matching any allowed type', () => {
      expect(() => assertArrayOfLiteralType(['foo', 123, 'bar'], ['string', 'number'])).to.not.throw();
      expect(() => assertArrayOfLiteralType([1, 'two', 3], ['string', 'number'])).to.not.throw();
      expect(() => assertArrayOfLiteralType([true, 42, 'test'], ['boolean', 'number', 'string'])).to.not.throw();
    });

    it('should not throw for empty arrays with array of types', () => {
      expect(() => assertArrayOfLiteralType([], ['string', 'number'])).to.not.throw();
    });

    it('should throw when array contains element not matching any allowed type', () => {
      expect(() => assertArrayOfLiteralType(['foo', null], ['string', 'number'])).to.throw(TypeHelpersAssertionError, 'Expected type "string", "number"');
      expect(() => assertArrayOfLiteralType([1, undefined], ['string', 'boolean'])).to.throw(TypeHelpersAssertionError);
    });

    it('should work with custom error message and array of types', () => {
      expect(() => assertArrayOfLiteralType(['foo', null], ['string', 'number'], 'Custom message')).to.throw(TypeHelpersAssertionError, 'Custom message');
    });
  });

  describe('assertObjectValueType()', () => {
    it('should not throw for objects with all values of correct type', () => {
      expect(() => assertObjectValueType({ a: 'foo', b: 'bar' }, 'string')).to.not.throw();
      expect(() => assertObjectValueType({ x: 1, y: 2, z: 3 }, 'number')).to.not.throw();
      expect(() => assertObjectValueType({ flag1: true, flag2: false }, 'boolean')).to.not.throw();
    });

    it('should not throw for empty objects', () => {
      expect(() => assertObjectValueType({}, 'string')).to.not.throw();
      expect(() => assertObjectValueType({}, 'number')).to.not.throw();
    });

    it('should throw when object contains value of wrong type', () => {
      expect(() => assertObjectValueType({ a: 'foo', b: 123 }, 'string')).to.throw(TypeHelpersAssertionError, 'Expected object values to have type "string"');
      expect(() => assertObjectValueType({ x: 1, y: 'two' }, 'number')).to.throw(TypeHelpersAssertionError, 'Expected object values to have type "number"');
    });

    it('should throw when value is not an object', () => {
      expect(() => assertObjectValueType('string', 'string')).to.throw(TypeHelpersAssertionError, 'Expected an object');
      expect(() => assertObjectValueType(null, 'string')).to.throw(TypeHelpersAssertionError, 'Expected an object');
      expect(() => assertObjectValueType(123, 'string')).to.throw(TypeHelpersAssertionError, 'Expected an object');
    });

    it('should validate that all keys are strings', () => {
      const obj = { a: 'foo', b: 'bar' };
      expect(() => assertObjectValueType(obj, 'string')).to.not.throw();
    });

    it('should not throw for objects with values of any allowed type (array)', () => {
      expect(() => assertObjectValueType({ a: 'foo', b: 123, c: true }, ['string', 'number', 'boolean'])).to.not.throw();
      expect(() => assertObjectValueType({ x: 1, y: 'two' }, ['string', 'number'])).to.not.throw();
      expect(() => assertObjectValueType({ flag: true, count: 42 }, ['boolean', 'number'])).to.not.throw();
    });

    it('should not throw for empty objects with array of types', () => {
      expect(() => assertObjectValueType({}, ['string', 'number'])).to.not.throw();
    });

    it('should throw when object contains value not matching any allowed type', () => {
      expect(() => assertObjectValueType({ a: 'foo', b: null }, ['string', 'number'])).to.throw(TypeHelpersAssertionError, 'Expected object values to have type "string", "number"');
      expect(() => assertObjectValueType({ x: 1, y: undefined }, ['string', 'boolean'])).to.throw(TypeHelpersAssertionError, 'Expected object values to have type "string", "boolean"');
    });
  });
});
