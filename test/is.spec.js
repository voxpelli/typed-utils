/* eslint-disable unicorn/no-null, unicorn/no-useless-undefined */
import chai from 'chai';
import { describe, it } from 'mocha';

import {
  isKeyWithType,
  isKeyWithValue,
  isObjectWithKey,
  isOptionalKeyWithType,
  isPropertyKey,
} from '../lib/is.js';

const { expect } = chai;

describe('is', () => {
  describe('isObjectWithKey()', () => {
    it('should return true when key exists on object', () => {
      expect(isObjectWithKey({ foo: 'bar' }, 'foo')).to.equal(true);
      expect(isObjectWithKey({ foo: undefined }, 'foo')).to.equal(true);
    });

    it('should return false when key does not exist', () => {
      expect(isObjectWithKey({ foo: 'bar' }, 'baz')).to.equal(false);
      expect(isObjectWithKey({}, 'foo')).to.equal(false);
    });

    it('should return false for non-objects', () => {
      expect(isObjectWithKey(null, 'foo')).to.equal(false);
      expect(isObjectWithKey(undefined, 'foo')).to.equal(false);
      expect(isObjectWithKey('string', 'foo')).to.equal(false);
      expect(isObjectWithKey(123, 'foo')).to.equal(false);
    });
  });

  describe('isKeyWithValue()', () => {
    it('should return true when key exists with matching value', () => {
      expect(isKeyWithValue({ foo: 'bar' }, 'foo', 'bar')).to.equal(true);
      expect(isKeyWithValue({ num: 123 }, 'num', 123)).to.equal(true);
    });

    it('should return false when key does not exist', () => {
      expect(isKeyWithValue({ foo: 'bar' }, 'baz', 'bar')).to.equal(false);
    });

    it('should return false when key exists but has wrong value', () => {
      expect(isKeyWithValue({ foo: 'bar' }, 'foo', 'baz')).to.equal(false);
    });
  });

  describe('isKeyWithType()', () => {
    it('should return true when key exists with matching type', () => {
      expect(isKeyWithType({ foo: 'bar' }, 'foo', 'string')).to.equal(true);
      expect(isKeyWithType({ num: 42 }, 'num', 'number')).to.equal(true);
      expect(isKeyWithType({ flag: true }, 'flag', 'boolean')).to.equal(true);
      expect(isKeyWithType({ arr: [] }, 'arr', 'array')).to.equal(true);
      expect(isKeyWithType({ obj: {} }, 'obj', 'object')).to.equal(true);
    });

    it('should return false when key does not exist', () => {
      expect(isKeyWithType({ foo: 'bar' }, 'baz', 'string')).to.equal(false);
    });

    it('should return false when key exists but type does not match', () => {
      expect(isKeyWithType({ foo: 'bar' }, 'foo', 'number')).to.equal(false);
      expect(isKeyWithType({ num: 42 }, 'num', 'string')).to.equal(false);
    });

    it('should return false for non-objects', () => {
      expect(isKeyWithType(null, 'foo', 'string')).to.equal(false);
      expect(isKeyWithType('string', 'foo', 'string')).to.equal(false);
    });
  });

  describe('isKeyWithType() with array of types', () => {
    it('should return true when value matches any allowed type', () => {
      expect(isKeyWithType({ x: 'hello' }, 'x', ['string', 'number'])).to.equal(true);
      expect(isKeyWithType({ x: 42 }, 'x', ['string', 'number'])).to.equal(true);
      expect(isKeyWithType({ x: true }, 'x', ['boolean', 'number'])).to.equal(true);
    });

    it('should return false when value matches none of the allowed types', () => {
      expect(isKeyWithType({ x: true }, 'x', ['string', 'number'])).to.equal(false);
      expect(isKeyWithType({ x: 'hello' }, 'x', ['number', 'boolean'])).to.equal(false);
    });

    it('should work with single-element array', () => {
      expect(isKeyWithType({ x: 'hello' }, 'x', ['string'])).to.equal(true);
      expect(isKeyWithType({ x: 42 }, 'x', ['string'])).to.equal(false);
    });

    it('should return false for key not in object', () => {
      expect(isKeyWithType({ x: 'hello' }, 'y', ['string', 'number'])).to.equal(false);
    });

    it('should return false when object is not an object', () => {
      expect(isKeyWithType(undefined, 'x', ['string', 'number'])).to.equal(false);
      expect(isKeyWithType('not an object', 'x', ['string', 'number'])).to.equal(false);
    });

    it('should work with null as an allowed type', () => {
      expect(isKeyWithType({ x: null }, 'x', ['string', 'null'])).to.equal(true);

      expect(isKeyWithType({ x: null }, 'x', ['number', 'boolean'])).to.equal(false);
      expect(isKeyWithType({ x: 'hello' }, 'x', ['string', 'null'])).to.equal(true);
    });
  });

  describe('isOptionalKeyWithType()', () => {
    it('should return true when key is absent', () => {
      expect(isOptionalKeyWithType({ foo: 'bar' }, 'baz', 'string')).to.equal(true);
      expect(isOptionalKeyWithType({}, 'foo', 'string')).to.equal(true);
    });

    it('should return true when key is present but undefined', () => {
      expect(isOptionalKeyWithType({ foo: undefined }, 'foo', 'string')).to.equal(true);
    });

    it('should return true when key is present with matching type', () => {
      expect(isOptionalKeyWithType({ foo: 'bar' }, 'foo', 'string')).to.equal(true);
      expect(isOptionalKeyWithType({ num: 42 }, 'num', 'number')).to.equal(true);
    });

    it('should return false when key is present with wrong type', () => {
      expect(isOptionalKeyWithType({ foo: 123 }, 'foo', 'string')).to.equal(false);
      expect(isOptionalKeyWithType({ foo: 'bar' }, 'foo', 'number')).to.equal(false);
    });

    it('should return false for non-objects', () => {
      expect(isOptionalKeyWithType(null, 'foo', 'string')).to.equal(false);
      expect(isOptionalKeyWithType(undefined, 'foo', 'string')).to.equal(false);
      expect(isOptionalKeyWithType('string', 'foo', 'string')).to.equal(false);
    });
  });

  describe('isOptionalKeyWithType() with array of types', () => {
    it('should return true when key is absent', () => {
      expect(isOptionalKeyWithType({ y: 'other' }, 'x', ['string', 'number'])).to.equal(true);
    });

    it('should return true when key exists with value matching any allowed type', () => {
      expect(isOptionalKeyWithType({ x: 'hello' }, 'x', ['string', 'number'])).to.equal(true);
      expect(isOptionalKeyWithType({ x: 42 }, 'x', ['string', 'number'])).to.equal(true);
    });

    it('should return true when key exists and is undefined', () => {
      expect(isOptionalKeyWithType({ x: undefined }, 'x', ['string', 'number'])).to.equal(true);
    });

    it('should return false when key exists with value matching none of the allowed types', () => {
      expect(isOptionalKeyWithType({ x: true }, 'x', ['string', 'number'])).to.equal(false);
      expect(isOptionalKeyWithType({ x: Symbol('sym') }, 'x', ['string', 'boolean'])).to.equal(false);
    });

    it('should return false when object is not an object', () => {
      expect(isOptionalKeyWithType(undefined, 'x', ['string', 'number'])).to.equal(false);
      expect(isOptionalKeyWithType('not an object', 'x', ['string', 'number'])).to.equal(false);
    });

    it('should work with single-element array', () => {
      expect(isOptionalKeyWithType({ x: 'hello' }, 'x', ['string'])).to.equal(true);
      expect(isOptionalKeyWithType({ y: 'other' }, 'x', ['string'])).to.equal(true);
      expect(isOptionalKeyWithType({ x: 42 }, 'x', ['string'])).to.equal(false);
    });

    it('should work with null as an allowed type', () => {
      expect(isOptionalKeyWithType({ x: null }, 'x', ['string', 'null'])).to.equal(true);

      expect(isOptionalKeyWithType({ x: null }, 'x', ['number', 'boolean'])).to.equal(false);
      expect(isOptionalKeyWithType({ x: 'hello' }, 'x', ['string', 'null'])).to.equal(true);
      expect(isOptionalKeyWithType({ y: 'other' }, 'x', ['string', 'null'])).to.equal(true);
    });
  });

  describe('isPropertyKey()', () => {
    it('should return true for strings', () => {
      expect(isPropertyKey('foo')).to.equal(true);
      expect(isPropertyKey('')).to.equal(true);
    });

    it('should return true for numbers', () => {
      expect(isPropertyKey(0)).to.equal(true);
      expect(isPropertyKey(42)).to.equal(true);
    });

    it('should return true for symbols', () => {
      expect(isPropertyKey(Symbol('test'))).to.equal(true);
    });

    it('should return false for non-PropertyKey values', () => {
      expect(isPropertyKey(null)).to.equal(false);
      expect(isPropertyKey(undefined)).to.equal(false);
      expect(isPropertyKey({})).to.equal(false);
      expect(isPropertyKey([])).to.equal(false);
      expect(isPropertyKey(true)).to.equal(false);
    });
  });
});
