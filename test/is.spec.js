import chai from 'chai';
import { describe, it } from 'mocha';

import { isKeyWithType, isKeyWithValue, isOptionalKeyWithType } from '../lib/is.js';

const { expect } = chai;

describe('is', () => {
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
      // eslint-disable-next-line unicorn/no-null
      expect(isKeyWithType({ x: null }, 'x', ['string', 'null'])).to.equal(true);
      // eslint-disable-next-line unicorn/no-null
      expect(isKeyWithType({ x: null }, 'x', ['number', 'boolean'])).to.equal(false);
      expect(isKeyWithType({ x: 'hello' }, 'x', ['string', 'null'])).to.equal(true);
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
      // eslint-disable-next-line unicorn/no-null
      expect(isOptionalKeyWithType({ x: null }, 'x', ['string', 'null'])).to.equal(true);
      // eslint-disable-next-line unicorn/no-null
      expect(isOptionalKeyWithType({ x: null }, 'x', ['number', 'boolean'])).to.equal(false);
      expect(isOptionalKeyWithType({ x: 'hello' }, 'x', ['string', 'null'])).to.equal(true);
      expect(isOptionalKeyWithType({ y: 'other' }, 'x', ['string', 'null'])).to.equal(true);
    });
  });
});
