import { describe, it } from 'mocha';
import { expect } from 'chai';

import { isType } from '../lib/is.js';
import { assertType, TypeHelpersAssertionError } from '../lib/assert.js';
import { explainVariable } from '../lib/misc.js';

describe('Literal Types', () => {
  describe('isType', () => {
    it('identifies string type', () => {
      expect(isType('hello', 'string')).to.equal(true);
      expect(isType(42, 'string')).to.equal(false);
      expect(isType(undefined, 'string')).to.equal(false);
    });

    it('identifies number type', () => {
      expect(isType(42, 'number')).to.equal(true);
      expect(isType(0, 'number')).to.equal(true);
      expect(isType('42', 'number')).to.equal(false);
      expect(isType(42n, 'number')).to.equal(false);
    });

    it('identifies bigint type', () => {
      expect(isType(42n, 'bigint')).to.equal(true);
      expect(isType(42, 'bigint')).to.equal(false);
      expect(isType('42', 'bigint')).to.equal(false);
    });

    it('identifies boolean type', () => {
      expect(isType(true, 'boolean')).to.equal(true);
      expect(isType(false, 'boolean')).to.equal(true);
      expect(isType(1, 'boolean')).to.equal(false);
      expect(isType('true', 'boolean')).to.equal(false);
    });

    it('identifies symbol type', () => {
      expect(isType(Symbol('test'), 'symbol')).to.equal(true);
      expect(isType('symbol', 'symbol')).to.equal(false);
      expect(isType({}, 'symbol')).to.equal(false);
    });

    it('identifies undefined type', () => {
      expect(isType(undefined, 'undefined')).to.equal(true);
      expect(isType(undefined, 'undefined')).to.equal(true);
    });

    it('identifies null type', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(isType(null, 'null')).to.equal(true);
      expect(isType(undefined, 'null')).to.equal(false);
      expect(isType('null', 'null')).to.equal(false);
    });

    it('identifies array type', () => {
      expect(isType([], 'array')).to.equal(true);
      expect(isType([1, 2, 3], 'array')).to.equal(true);
      expect(isType({}, 'array')).to.equal(false);
      expect(isType('array', 'array')).to.equal(false);
    });

    it('identifies function type', () => {
      expect(isType(() => {}, 'function')).to.equal(true);
      expect(isType(function () {}, 'function')).to.equal(true);
      expect(isType(async () => {}, 'function')).to.equal(true);
      expect(isType(class MyClass {}, 'function')).to.equal(true);
      expect(isType({}, 'function')).to.equal(false);
      expect(isType('function', 'function')).to.equal(false);
    });

    it('identifies object type', () => {
      expect(isType({}, 'object')).to.equal(true);
      expect(isType({ a: 1 }, 'object')).to.equal(true);
      expect(isType([], 'object')).to.equal(false);
      expect(isType(undefined, 'object')).to.equal(false);
      expect(isType('object', 'object')).to.equal(false);
    });

    it('handles edge cases: falsy values', () => {
      expect(isType(0, 'number')).to.equal(true);
      expect(isType('', 'string')).to.equal(true);
      expect(isType(false, 'boolean')).to.equal(true);
    });
  });

  describe('isType with array of types', () => {
    it('should return true for values matching any allowed type', () => {
      expect(isType('hello', ['string', 'number'])).to.equal(true);
      expect(isType(42, ['string', 'number'])).to.equal(true);
      expect(isType(true, ['boolean', 'number'])).to.equal(true);
      expect(isType([], ['array', 'object'])).to.equal(true);
    });

    it('should return false for values matching none of the allowed types', () => {
      expect(isType(true, ['string', 'number'])).to.equal(false);
      expect(isType('hello', ['number', 'boolean'])).to.equal(false);
      // eslint-disable-next-line unicorn/no-null
      expect(isType(null, ['string', 'number', 'boolean'])).to.equal(false);
    });

    it('should work with single-element array', () => {
      expect(isType('hello', ['string'])).to.equal(true);
      expect(isType(42, ['string'])).to.equal(false);
    });

    it('should handle empty array (always returns false)', () => {
      expect(isType('hello', [])).to.equal(false);
      expect(isType(42, [])).to.equal(false);
      expect(isType(true, [])).to.equal(false);
    });

    it('should work with all literal types in array', () => {
      expect(isType('test', ['string', 'number', 'boolean', 'null', 'undefined', 'array', 'object', 'function', 'symbol', 'bigint'])).to.equal(true);
      expect(isType(42, ['string', 'number', 'boolean'])).to.equal(true);
    });
  });

  describe('assertType', () => {
    it('passes for matching type - string', () => {
      const value = 'hello';
      expect(() => assertType(value, 'string')).to.not.throw();
    });

    it('passes for matching type - number', () => {
      const value = 42;
      expect(() => assertType(value, 'number')).to.not.throw();
    });

    it('passes for matching type - bigint', () => {
      const value = 42n;
      expect(() => assertType(value, 'bigint')).to.not.throw();
    });

    it('passes for matching type - boolean', () => {
      const value = true;
      expect(() => assertType(value, 'boolean')).to.not.throw();
    });

    it('passes for matching type - symbol', () => {
      const value = Symbol('test');
      expect(() => assertType(value, 'symbol')).to.not.throw();
    });

    it('passes for matching type - undefined', () => {
      const value = undefined;
      expect(() => assertType(value, 'undefined')).to.not.throw();
    });

    it('passes for matching type - null', () => {
      // eslint-disable-next-line unicorn/no-null
      const value = null;
      expect(() => assertType(value, 'null')).to.not.throw();
    });

    it('passes for matching type - array', () => {
      expect(() => assertType([], 'array')).to.not.throw();
    });

    it('passes for matching type - object', () => {
      const obj = {};
      expect(() => assertType(obj, 'object')).to.not.throw();
    });

    it('throws TypeHelpersAssertionError for mismatched type', () => {
      expect(() => assertType('hello', 'number')).to.throw(TypeHelpersAssertionError);
      expect(() => assertType(42, 'string')).to.throw(TypeHelpersAssertionError);
      expect(() => assertType([], 'object')).to.throw(TypeHelpersAssertionError);
      expect(() => assertType(undefined, 'undefined')).to.not.throw();
    });

    it('throws error with helpful message', () => {
      try {
        assertType('hello', 'number');
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(TypeHelpersAssertionError);
        if (err instanceof TypeHelpersAssertionError) {
          expect(err.message).to.include('number');
        }
      }
    });

    it('handles edge cases: falsy values', () => {
      expect(() => assertType(0, 'number')).to.not.throw();
      expect(() => assertType('', 'string')).to.not.throw();
      expect(() => assertType(false, 'boolean')).to.not.throw();
    });
  });

  describe('assertType with array of types', () => {
    it('should not throw for values matching any allowed type', () => {
      expect(() => assertType('hello', ['string', 'number'])).to.not.throw();
      expect(() => assertType(42, ['string', 'number'])).to.not.throw();
      expect(() => assertType(true, ['boolean', 'number'])).to.not.throw();
      expect(() => assertType([], ['array', 'object'])).to.not.throw();
    });

    it('should throw when value matches none of the allowed types', () => {
      expect(() => assertType(true, ['string', 'number'])).to.throw(TypeHelpersAssertionError);
      expect(() => assertType('hello', ['number', 'boolean'])).to.throw(TypeHelpersAssertionError);
    });

    it('should throw with error message including all types', () => {
      try {
        assertType(true, ['string', 'number']);
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(TypeHelpersAssertionError);
        if (err instanceof TypeHelpersAssertionError) {
          expect(err.message).to.include('string');
          expect(err.message).to.include('number');
        }
      }
    });

    it('should work with single-element array', () => {
      expect(() => assertType('hello', ['string'])).to.not.throw();
      expect(() => assertType(42, ['string'])).to.throw(TypeHelpersAssertionError);
    });

    it('should handle empty array (always throws)', () => {
      expect(() => assertType('hello', [])).to.throw(TypeHelpersAssertionError);
      expect(() => assertType(42, [])).to.throw(TypeHelpersAssertionError);
    });

    it('should work with custom error message', () => {
      try {
        assertType(true, ['string', 'number'], 'Custom error');
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(TypeHelpersAssertionError);
        if (err instanceof TypeHelpersAssertionError) {
          expect(err.message).to.include('Custom error');
        }
      }
    });
  });

  describe('explainVariable', () => {
    it('returns string for string values', () => {
      expect(explainVariable('hello')).to.equal('string');
      expect(explainVariable('')).to.equal('string');
    });

    it('returns number for number values', () => {
      expect(explainVariable(42)).to.equal('number');
      expect(explainVariable(0)).to.equal('number');
      expect(explainVariable(-1)).to.equal('number');
    });

    it('returns bigint for bigint values', () => {
      expect(explainVariable(42n)).to.equal('bigint');
    });

    it('returns boolean for boolean values', () => {
      expect(explainVariable(true)).to.equal('boolean');
      expect(explainVariable(false)).to.equal('boolean');
    });

    it('returns symbol for symbol values', () => {
      expect(explainVariable(Symbol('test'))).to.equal('symbol');
    });

    it('returns undefined for undefined values', () => {
      // undefined is tested via type checks
    });

    it('returns null for null values', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(explainVariable(null)).to.equal('null');
    });

    it('returns array for array values', () => {
      expect(explainVariable([])).to.equal('array');
      expect(explainVariable([1, 2, 3])).to.equal('array');
    });

    it('returns function for function values', () => {
      expect(explainVariable(() => {})).to.equal('function');
      expect(explainVariable(function () {})).to.equal('function');
      expect(explainVariable(async () => {})).to.equal('function');
      expect(explainVariable(class MyClass {})).to.equal('function');
    });

    it('returns object for object values', () => {
      expect(explainVariable({})).to.equal('object');
      expect(explainVariable({ a: 1 })).to.equal('object');
    });

    it('handles edge cases: falsy values', () => {
      expect(explainVariable(0)).to.equal('number');
      expect(explainVariable('')).to.equal('string');
      expect(explainVariable(false)).to.equal('boolean');
    });
  });
});
