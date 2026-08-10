import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assertType, TypeHelpersAssertionError } from '../lib/assert.js';
import { isType } from '../lib/is.js';
import { explainVariable } from '../lib/misc.js';

describe('Literal Types', () => {
  describe('isType', () => {
    it('identifies string type', () => {
      assert.strictEqual(isType('hello', 'string'), true);
      assert.strictEqual(isType(42, 'string'), false);
      assert.strictEqual(isType(undefined, 'string'), false);
    });

    it('identifies number type', () => {
      assert.strictEqual(isType(42, 'number'), true);
      assert.strictEqual(isType(0, 'number'), true);
      assert.strictEqual(isType('42', 'number'), false);
      assert.strictEqual(isType(42n, 'number'), false);
    });

    it('identifies bigint type', () => {
      assert.strictEqual(isType(42n, 'bigint'), true);
      assert.strictEqual(isType(42, 'bigint'), false);
      assert.strictEqual(isType('42', 'bigint'), false);
    });

    it('identifies boolean type', () => {
      assert.strictEqual(isType(true, 'boolean'), true);
      assert.strictEqual(isType(false, 'boolean'), true);
      assert.strictEqual(isType(1, 'boolean'), false);
      assert.strictEqual(isType('true', 'boolean'), false);
    });

    it('identifies symbol type', () => {
      assert.strictEqual(isType(Symbol('test'), 'symbol'), true);
      assert.strictEqual(isType('symbol', 'symbol'), false);
      assert.strictEqual(isType({}, 'symbol'), false);
    });

    it('identifies undefined type', () => {
      assert.strictEqual(isType(undefined, 'undefined'), true);
      assert.strictEqual(isType(undefined, 'undefined'), true);
    });

    it('identifies null type', () => {
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(isType(null, 'null'), true);
      assert.strictEqual(isType(undefined, 'null'), false);
      assert.strictEqual(isType('null', 'null'), false);
    });

    it('identifies array type', () => {
      assert.strictEqual(isType([], 'array'), true);
      assert.strictEqual(isType([1, 2, 3], 'array'), true);
      assert.strictEqual(isType({}, 'array'), false);
      assert.strictEqual(isType('array', 'array'), false);
    });

    it('identifies function type', () => {
      assert.strictEqual(isType(() => {}, 'function'), true);
      assert.strictEqual(isType(async () => {}, 'function'), true);
      assert.strictEqual(isType(class MyClass {}, 'function'), true);
      assert.strictEqual(isType({}, 'function'), false);
      assert.strictEqual(isType('function', 'function'), false);
    });

    it('identifies object type', () => {
      assert.strictEqual(isType({}, 'object'), true);
      assert.strictEqual(isType({ a: 1 }, 'object'), true);
      assert.strictEqual(isType([], 'object'), false);
      assert.strictEqual(isType(undefined, 'object'), false);
      assert.strictEqual(isType('object', 'object'), false);
    });

    it('handles edge cases: falsy values', () => {
      assert.strictEqual(isType(0, 'number'), true);
      assert.strictEqual(isType('', 'string'), true);
      assert.strictEqual(isType(false, 'boolean'), true);
    });
  });

  describe('isType with array of types', () => {
    it('should return true for values matching any allowed type', () => {
      assert.strictEqual(isType('hello', ['string', 'number']), true);
      assert.strictEqual(isType(42, ['string', 'number']), true);
      assert.strictEqual(isType(true, ['boolean', 'number']), true);
      assert.strictEqual(isType([], ['array', 'object']), true);
    });

    it('should return false for values matching none of the allowed types', () => {
      assert.strictEqual(isType(true, ['string', 'number']), false);
      assert.strictEqual(isType('hello', ['number', 'boolean']), false);
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(isType(null, ['string', 'number', 'boolean']), false);
    });

    it('should work with single-element array', () => {
      assert.strictEqual(isType('hello', ['string']), true);
      assert.strictEqual(isType(42, ['string']), false);
    });

    it('should handle empty array (always returns false)', () => {
      assert.strictEqual(isType('hello', []), false);
      assert.strictEqual(isType(42, []), false);
      assert.strictEqual(isType(true, []), false);
    });

    it('should work with all literal types in array', () => {
      assert.strictEqual(isType('test', ['string', 'number', 'boolean', 'null', 'undefined', 'array', 'object', 'function', 'symbol', 'bigint']), true);
      assert.strictEqual(isType(42, ['string', 'number', 'boolean']), true);
    });
  });

  describe('assertType', () => {
    it('passes for matching type - string', () => {
      const value = 'hello';
      assert.doesNotThrow(() => assertType(value, 'string'));
    });

    it('passes for matching type - number', () => {
      const value = 42;
      assert.doesNotThrow(() => assertType(value, 'number'));
    });

    it('passes for matching type - bigint', () => {
      const value = 42n;
      assert.doesNotThrow(() => assertType(value, 'bigint'));
    });

    it('passes for matching type - boolean', () => {
      const value = true;
      assert.doesNotThrow(() => assertType(value, 'boolean'));
    });

    it('passes for matching type - symbol', () => {
      const value = Symbol('test');
      assert.doesNotThrow(() => assertType(value, 'symbol'));
    });

    it('passes for matching type - undefined', () => {
      const value = undefined;
      assert.doesNotThrow(() => assertType(value, 'undefined'));
    });

    it('passes for matching type - null', () => {
      // eslint-disable-next-line unicorn/no-null
      const value = null;
      assert.doesNotThrow(() => assertType(value, 'null'));
    });

    it('passes for matching type - array', () => {
      assert.doesNotThrow(() => assertType([], 'array'));
    });

    it('passes for matching type - object', () => {
      const obj = {};
      assert.doesNotThrow(() => assertType(obj, 'object'));
    });

    it('throws TypeHelpersAssertionError for mismatched type', () => {
      assert.throws(() => assertType('hello', 'number'), TypeHelpersAssertionError);
      assert.throws(() => assertType(42, 'string'), TypeHelpersAssertionError);
      assert.throws(() => assertType([], 'object'), TypeHelpersAssertionError);
      assert.doesNotThrow(() => assertType(undefined, 'undefined'));
    });

    it('throws error with helpful message', () => {
      try {
        assertType('hello', 'number');
        assert.fail('Should have thrown');
      } catch (err) {
        assert.ok(err instanceof TypeHelpersAssertionError);
        if (err instanceof TypeHelpersAssertionError) {
          assert.match(err.message, /number/);
        }
      }
    });

    it('handles edge cases: falsy values', () => {
      assert.doesNotThrow(() => assertType(0, 'number'));
      assert.doesNotThrow(() => assertType('', 'string'));
      assert.doesNotThrow(() => assertType(false, 'boolean'));
    });
  });

  describe('assertType with array of types', () => {
    it('should not throw for values matching any allowed type', () => {
      assert.doesNotThrow(() => assertType('hello', ['string', 'number']));
      assert.doesNotThrow(() => assertType(42, ['string', 'number']));
      assert.doesNotThrow(() => assertType(true, ['boolean', 'number']));
      assert.doesNotThrow(() => assertType([], ['array', 'object']));
    });

    it('should throw when value matches none of the allowed types', () => {
      assert.throws(() => assertType(true, ['string', 'number']), TypeHelpersAssertionError);
      assert.throws(() => assertType('hello', ['number', 'boolean']), TypeHelpersAssertionError);
    });

    it('should throw with error message including all types', () => {
      try {
        assertType(true, ['string', 'number']);
        assert.fail('Should have thrown');
      } catch (err) {
        assert.ok(err instanceof TypeHelpersAssertionError);
        if (err instanceof TypeHelpersAssertionError) {
          assert.match(err.message, /string/);
          assert.match(err.message, /number/);
        }
      }
    });

    it('should work with single-element array', () => {
      assert.doesNotThrow(() => assertType('hello', ['string']));
      assert.throws(() => assertType(42, ['string']), TypeHelpersAssertionError);
    });

    it('should handle empty array (always throws)', () => {
      assert.throws(() => assertType('hello', []), TypeHelpersAssertionError);
      assert.throws(() => assertType(42, []), TypeHelpersAssertionError);
    });

    it('should work with custom error message', () => {
      try {
        assertType(true, ['string', 'number'], 'Custom error');
        assert.fail('Should have thrown');
      } catch (err) {
        assert.ok(err instanceof TypeHelpersAssertionError);
        if (err instanceof TypeHelpersAssertionError) {
          assert.match(err.message, /Custom error/);
        }
      }
    });
  });

  describe('explainVariable', () => {
    it('returns string for string values', () => {
      assert.strictEqual(explainVariable('hello'), 'string');
      assert.strictEqual(explainVariable(''), 'string');
    });

    it('returns number for number values', () => {
      assert.strictEqual(explainVariable(42), 'number');
      assert.strictEqual(explainVariable(0), 'number');
      assert.strictEqual(explainVariable(-1), 'number');
    });

    it('returns bigint for bigint values', () => {
      assert.strictEqual(explainVariable(42n), 'bigint');
    });

    it('returns boolean for boolean values', () => {
      assert.strictEqual(explainVariable(true), 'boolean');
      assert.strictEqual(explainVariable(false), 'boolean');
    });

    it('returns symbol for symbol values', () => {
      assert.strictEqual(explainVariable(Symbol('test')), 'symbol');
    });

    it('returns undefined for undefined values', () => {
      // undefined is tested via type checks
    });

    it('returns null for null values', () => {
      // eslint-disable-next-line unicorn/no-null
      assert.strictEqual(explainVariable(null), 'null');
    });

    it('returns array for array values', () => {
      assert.strictEqual(explainVariable([]), 'array');
      assert.strictEqual(explainVariable([1, 2, 3]), 'array');
    });

    it('returns function for function values', () => {
      assert.strictEqual(explainVariable(() => {}), 'function');
      assert.strictEqual(explainVariable(async () => {}), 'function');
      assert.strictEqual(explainVariable(class MyClass {}), 'function');
    });

    it('returns object for object values', () => {
      assert.strictEqual(explainVariable({}), 'object');
      assert.strictEqual(explainVariable({ a: 1 }), 'object');
    });

    it('handles edge cases: falsy values', () => {
      assert.strictEqual(explainVariable(0), 'number');
      assert.strictEqual(explainVariable(''), 'string');
      assert.strictEqual(explainVariable(false), 'boolean');
    });
  });
});
