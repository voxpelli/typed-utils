/* eslint-disable unicorn/no-null, unicorn/no-useless-undefined */
import chai from 'chai';

import {
  isObjectWithKey,
  isKeyWithType,
  isOptionalKeyWithType,
  isPropertyKey,
} from '../lib/is.js';

chai.should();

describe('is helpers', () => {
  describe('isObjectWithKey()', () => {
    it('should return true when key exists on object', () => {
      isObjectWithKey({ foo: 'bar' }, 'foo').should.be.ok;
      isObjectWithKey({ foo: undefined }, 'foo').should.be.ok;
    });

    it('should return false when key does not exist', () => {
      isObjectWithKey({ foo: 'bar' }, 'baz').should.not.be.ok;
      isObjectWithKey({}, 'foo').should.not.be.ok;
    });

    it('should return false for non-objects', () => {
      isObjectWithKey(null, 'foo').should.not.be.ok;
      isObjectWithKey(undefined, 'foo').should.not.be.ok;
      isObjectWithKey('string', 'foo').should.not.be.ok;
      isObjectWithKey(123, 'foo').should.not.be.ok;
    });
  });

  describe('isKeyWithType()', () => {
    it('should return true when key exists with matching type', () => {
      isKeyWithType({ foo: 'bar' }, 'foo', 'string').should.be.ok;
      isKeyWithType({ num: 42 }, 'num', 'number').should.be.ok;
      isKeyWithType({ flag: true }, 'flag', 'boolean').should.be.ok;
      isKeyWithType({ arr: [] }, 'arr', 'array').should.be.ok;
      isKeyWithType({ obj: {} }, 'obj', 'object').should.be.ok;
    });

    it('should return false when key does not exist', () => {
      isKeyWithType({ foo: 'bar' }, 'baz', 'string').should.not.be.ok;
    });

    it('should return false when key exists but type does not match', () => {
      isKeyWithType({ foo: 'bar' }, 'foo', 'number').should.not.be.ok;
      isKeyWithType({ num: 42 }, 'num', 'string').should.not.be.ok;
    });

    it('should return false for non-objects', () => {
      isKeyWithType(null, 'foo', 'string').should.not.be.ok;
      isKeyWithType('string', 'foo', 'string').should.not.be.ok;
    });
  });

  describe('isOptionalKeyWithType()', () => {
    it('should return true when key is absent', () => {
      isOptionalKeyWithType({ foo: 'bar' }, 'baz', 'string').should.be.ok;
      isOptionalKeyWithType({}, 'foo', 'string').should.be.ok;
    });

    it('should return true when key is present but undefined', () => {
      isOptionalKeyWithType({ foo: undefined }, 'foo', 'string').should.be.ok;
    });

    it('should return true when key is present with matching type', () => {
      isOptionalKeyWithType({ foo: 'bar' }, 'foo', 'string').should.be.ok;
      isOptionalKeyWithType({ num: 42 }, 'num', 'number').should.be.ok;
    });

    it('should return false when key is present with wrong type', () => {
      isOptionalKeyWithType({ foo: 123 }, 'foo', 'string').should.not.be.ok;
      isOptionalKeyWithType({ foo: 'bar' }, 'foo', 'number').should.not.be.ok;
    });

    it('should return false for non-objects', () => {
      isOptionalKeyWithType(null, 'foo', 'string').should.not.be.ok;
      isOptionalKeyWithType(undefined, 'foo', 'string').should.not.be.ok;
      isOptionalKeyWithType('string', 'foo', 'string').should.not.be.ok;
    });
  });

  describe('isPropertyKey()', () => {
    it('should return true for strings', () => {
      isPropertyKey('foo').should.be.ok;
      isPropertyKey('').should.be.ok;
    });

    it('should return true for numbers', () => {
      isPropertyKey(0).should.be.ok;
      isPropertyKey(42).should.be.ok;
    });

    it('should return true for symbols', () => {
      isPropertyKey(Symbol('test')).should.be.ok;
    });

    it('should return false for non-PropertyKey values', () => {
      isPropertyKey(null).should.not.be.ok;
      isPropertyKey(undefined).should.not.be.ok;
      isPropertyKey({}).should.not.be.ok;
      isPropertyKey([]).should.not.be.ok;
      isPropertyKey(true).should.not.be.ok;
    });
  });
});
