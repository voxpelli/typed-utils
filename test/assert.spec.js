/* eslint-disable unicorn/no-null, unicorn/no-useless-undefined */
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

chai.should();

describe('assert', () => {
  describe('TypeHelpersAssertionError', () => {
    it('should be an Error instance', () => {
      const error = new TypeHelpersAssertionError('test');
      error.should.be.instanceOf(Error);
      error.name.should.equal('TypeHelpersAssertionError');
      error.message.should.equal('test');
    });

    it('should capture stack trace', () => {
      const error = new TypeHelpersAssertionError('test');
      // Error.stack is always a string in Node.js environments
      (error.stack ?? '').should.be.a('string').and.include('TypeHelpersAssertionError');
    });
  });

  describe('assert()', () => {
    it('should not throw when condition is true', () => {
      (() => assert(true, 'should not throw')).should.not.throw();
    });

    it('should throw TypeHelpersAssertionError when condition is false', () => {
      (() => assert(false, 'test message')).should.throw(TypeHelpersAssertionError, 'test message');
    });
  });

  describe('assertObject()', () => {
    it('should not throw for valid objects', () => {
      (() => assertObject({})).should.not.throw();
      (() => assertObject({ foo: 'bar' })).should.not.throw();
      (() => assertObject([])).should.not.throw();
    });

    it('should throw for non-objects', () => {
      (() => assertObject(null)).should.throw(TypeHelpersAssertionError);
      (() => assertObject(undefined)).should.throw(TypeHelpersAssertionError);
      (() => assertObject('string')).should.throw(TypeHelpersAssertionError);
      (() => assertObject(123)).should.throw(TypeHelpersAssertionError);
    });
  });

  describe('assertObjectWithKey()', () => {
    it('should not throw when key exists', () => {
      (() => assertObjectWithKey({ foo: 'bar' }, 'foo')).should.not.throw();
    });

    it('should throw when key does not exist', () => {
      (() => assertObjectWithKey({ foo: 'bar' }, 'baz')).should.throw(TypeHelpersAssertionError, 'Expected key "baz" to exist');
    });

    it('should throw when value is not an object', () => {
      (() => assertObjectWithKey('string', 'foo')).should.throw(TypeHelpersAssertionError, 'Expected an object');
    });
  });

  describe('assertType()', () => {
    it('should not throw for correct types', () => {
      (() => assertType('foo', 'string')).should.not.throw();
      (() => assertType(123, 'number')).should.not.throw();
      (() => assertType(true, 'boolean')).should.not.throw();
      (() => assertType([], 'array')).should.not.throw();
      (() => assertType({}, 'object')).should.not.throw();
      (() => assertType(null, 'null')).should.not.throw();
    });

    it('should throw for incorrect types', () => {
      (() => assertType('foo', 'number')).should.throw(TypeHelpersAssertionError, 'Expected type "number"');
      (() => assertType(123, 'string')).should.throw(TypeHelpersAssertionError, 'Expected type "string"');
    });

    it('should accept custom error message', () => {
      (() => assertType('foo', 'number', 'Custom error')).should.throw(TypeHelpersAssertionError, 'Custom error');
    });
  });

  describe('assertKeyWithType()', () => {
    it('should not throw when key exists with correct type', () => {
      (() => assertKeyWithType({ foo: 'bar' }, 'foo', 'string')).should.not.throw();
      (() => assertKeyWithType({ num: 123 }, 'num', 'number')).should.not.throw();
    });

    it('should throw when key does not exist', () => {
      (() => assertKeyWithType({ foo: 'bar' }, 'baz', 'string')).should.throw(TypeHelpersAssertionError, 'Expected key "baz" to exist');
    });

    it('should throw when key exists but has wrong type', () => {
      (() => assertKeyWithType({ foo: 'bar' }, 'foo', 'number')).should.throw(TypeHelpersAssertionError, 'Expected key "foo" to have type "number"');
    });
  });

  describe('assertOptionalKeyWithType()', () => {
    it('should not throw when key does not exist', () => {
      (() => assertOptionalKeyWithType({ foo: 'bar' }, 'baz', 'string')).should.not.throw();
    });

    it('should not throw when key is undefined', () => {
      (() => assertOptionalKeyWithType({ foo: undefined }, 'foo', 'string')).should.not.throw();
    });

    it('should not throw when key exists with correct type', () => {
      (() => assertOptionalKeyWithType({ foo: 'bar' }, 'foo', 'string')).should.not.throw();
    });

    it('should throw when key exists with wrong type', () => {
      (() => assertOptionalKeyWithType({ foo: 123 }, 'foo', 'string')).should.throw(TypeHelpersAssertionError, 'Expected existing key "foo" to be undefined or have type "string"');
    });

    it('should throw when value is not an object', () => {
      (() => assertOptionalKeyWithType('string', 'foo', 'string')).should.throw(TypeHelpersAssertionError, 'Expected an object');
    });
  });

  describe('assertArrayOfLiteralType()', () => {
    it('should not throw for arrays with all elements of correct type', () => {
      (() => assertArrayOfLiteralType(['foo', 'bar', 'baz'], 'string')).should.not.throw();
      (() => assertArrayOfLiteralType([1, 2, 3], 'number')).should.not.throw();
      (() => assertArrayOfLiteralType([true, false], 'boolean')).should.not.throw();
      (() => assertArrayOfLiteralType([[], [1], [2, 3]], 'array')).should.not.throw();
    });

    it('should not throw for empty arrays', () => {
      (() => assertArrayOfLiteralType([], 'string')).should.not.throw();
      (() => assertArrayOfLiteralType([], 'number')).should.not.throw();
    });

    it('should throw when array contains element of wrong type', () => {
      (() => assertArrayOfLiteralType(['foo', 123, 'bar'], 'string')).should.throw(TypeHelpersAssertionError, 'Expected type "string"');
      (() => assertArrayOfLiteralType([1, 2, 'three'], 'number')).should.throw(TypeHelpersAssertionError, 'Expected type "number"');
    });

    it('should accept custom error message', () => {
      (() => assertArrayOfLiteralType(['foo', 123], 'string', 'Custom message')).should.throw(TypeHelpersAssertionError, 'Custom message');
    });

    it('should throw for non-array values', () => {
      (() => assertArrayOfLiteralType('not an array', 'string')).should.throw(TypeHelpersAssertionError, 'Expected an array');
      (() => assertArrayOfLiteralType(null, 'string')).should.throw(TypeHelpersAssertionError, 'Expected an array');
      (() => assertArrayOfLiteralType(undefined, 'string')).should.throw(TypeHelpersAssertionError, 'Expected an array');
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
      (() => assertObjectValueType({ a: 'foo', b: 'bar' }, 'string')).should.not.throw();
      (() => assertObjectValueType({ x: 1, y: 2, z: 3 }, 'number')).should.not.throw();
      (() => assertObjectValueType({ flag1: true, flag2: false }, 'boolean')).should.not.throw();
    });

    it('should not throw for empty objects', () => {
      (() => assertObjectValueType({}, 'string')).should.not.throw();
      (() => assertObjectValueType({}, 'number')).should.not.throw();
    });

    it('should throw when object contains value of wrong type', () => {
      (() => assertObjectValueType({ a: 'foo', b: 123 }, 'string')).should.throw(TypeHelpersAssertionError, 'Expected object values to have type "string"');
      (() => assertObjectValueType({ x: 1, y: 'two' }, 'number')).should.throw(TypeHelpersAssertionError, 'Expected object values to have type "number"');
    });

    it('should throw when value is not an object', () => {
      (() => assertObjectValueType('string', 'string')).should.throw(TypeHelpersAssertionError, 'Expected an object');
      (() => assertObjectValueType(null, 'string')).should.throw(TypeHelpersAssertionError, 'Expected an object');
      (() => assertObjectValueType(123, 'string')).should.throw(TypeHelpersAssertionError, 'Expected an object');
    });

    it('should validate that all keys are strings', () => {
      (() => assertObjectValueType({ a: 'foo', b: 'bar' }, 'string')).should.not.throw();
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
