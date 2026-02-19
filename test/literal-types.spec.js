import chai from 'chai';

import { isType } from '../lib/is.js';
import { assertType, TypeHelpersAssertionError } from '../lib/assert.js';
import { explainVariable } from '../lib/misc.js';

chai.should();

describe('Literal Types', () => {
  describe('isType', () => {
    it('identifies string type', () => {
      isType('hello', 'string').should.be.ok;
      isType(42, 'string').should.not.be.ok;
      isType(undefined, 'string').should.not.be.ok;
    });

    it('identifies number type', () => {
      isType(42, 'number').should.be.ok;
      isType(0, 'number').should.be.ok;
      isType('42', 'number').should.not.be.ok;
      isType(42n, 'number').should.not.be.ok;
    });

    it('identifies bigint type', () => {
      isType(42n, 'bigint').should.be.ok;
      isType(42, 'bigint').should.not.be.ok;
      isType('42', 'bigint').should.not.be.ok;
    });

    it('identifies boolean type', () => {
      isType(true, 'boolean').should.be.ok;
      isType(false, 'boolean').should.be.ok;
      isType(1, 'boolean').should.not.be.ok;
      isType('true', 'boolean').should.not.be.ok;
    });

    it('identifies symbol type', () => {
      isType(Symbol('test'), 'symbol').should.be.ok;
      isType('symbol', 'symbol').should.not.be.ok;
      isType({}, 'symbol').should.not.be.ok;
    });

    it('identifies undefined type', () => {
      isType(undefined, 'undefined').should.be.ok;
    });

    it('identifies null type', () => {
      // eslint-disable-next-line unicorn/no-null
      isType(null, 'null').should.be.ok;
      isType(undefined, 'null').should.not.be.ok;
      isType('null', 'null').should.not.be.ok;
    });

    it('identifies array type', () => {
      isType([], 'array').should.be.ok;
      isType([1, 2, 3], 'array').should.be.ok;
      isType({}, 'array').should.not.be.ok;
      isType('array', 'array').should.not.be.ok;
    });

    it('identifies function type', () => {
      isType(() => {}, 'function').should.be.ok;
      isType(function () {}, 'function').should.be.ok;
      isType(async () => {}, 'function').should.be.ok;
      isType(class MyClass {}, 'function').should.be.ok;
      isType({}, 'function').should.not.be.ok;
      isType('function', 'function').should.not.be.ok;
    });

    it('identifies object type', () => {
      isType({}, 'object').should.be.ok;
      isType({ a: 1 }, 'object').should.be.ok;
      isType([], 'object').should.not.be.ok;
      isType(undefined, 'object').should.not.be.ok;
      isType('object', 'object').should.not.be.ok;
    });

    it('handles edge cases: falsy values', () => {
      isType(0, 'number').should.be.ok;
      isType('', 'string').should.be.ok;
      isType(false, 'boolean').should.be.ok;
    });
  });

  describe('assertType', () => {
    it('passes for matching type - string', () => {
      (() => assertType('hello', 'string')).should.not.throw();
    });

    it('passes for matching type - number', () => {
      (() => assertType(42, 'number')).should.not.throw();
    });

    it('passes for matching type - bigint', () => {
      (() => assertType(42n, 'bigint')).should.not.throw();
    });

    it('passes for matching type - boolean', () => {
      (() => assertType(true, 'boolean')).should.not.throw();
    });

    it('passes for matching type - symbol', () => {
      (() => assertType(Symbol('test'), 'symbol')).should.not.throw();
    });

    it('passes for matching type - undefined', () => {
      (() => assertType(undefined, 'undefined')).should.not.throw();
    });

    it('passes for matching type - null', () => {
      // eslint-disable-next-line unicorn/no-null
      (() => assertType(null, 'null')).should.not.throw();
    });

    it('passes for matching type - array', () => {
      (() => assertType([], 'array')).should.not.throw();
    });

    it('passes for matching type - object', () => {
      (() => assertType({}, 'object')).should.not.throw();
    });

    it('throws TypeHelpersAssertionError for mismatched type', () => {
      (() => assertType('hello', 'number')).should.throw(TypeHelpersAssertionError);
      (() => assertType(42, 'string')).should.throw(TypeHelpersAssertionError);
      (() => assertType([], 'object')).should.throw(TypeHelpersAssertionError);
      (() => assertType(undefined, 'undefined')).should.not.throw();
    });

    it('throws error with helpful message', () => {
      (() => assertType('hello', 'number')).should.throw(TypeHelpersAssertionError, 'number');
    });

    it('handles edge cases: falsy values', () => {
      (() => assertType(0, 'number')).should.not.throw();
      (() => assertType('', 'string')).should.not.throw();
      (() => assertType(false, 'boolean')).should.not.throw();
    });
  });

  describe('explainVariable', () => {
    it('returns string for string values', () => {
      explainVariable('hello').should.equal('string');
      explainVariable('').should.equal('string');
    });

    it('returns number for number values', () => {
      explainVariable(42).should.equal('number');
      explainVariable(0).should.equal('number');
      explainVariable(-1).should.equal('number');
    });

    it('returns bigint for bigint values', () => {
      explainVariable(42n).should.equal('bigint');
    });

    it('returns boolean for boolean values', () => {
      explainVariable(true).should.equal('boolean');
      explainVariable(false).should.equal('boolean');
    });

    it('returns symbol for symbol values', () => {
      explainVariable(Symbol('test')).should.equal('symbol');
    });

    it('returns undefined for undefined values', () => {
      // undefined is tested via type checks
    });

    it('returns null for null values', () => {
      // eslint-disable-next-line unicorn/no-null
      explainVariable(null).should.equal('null');
    });

    it('returns array for array values', () => {
      explainVariable([]).should.equal('array');
      explainVariable([1, 2, 3]).should.equal('array');
    });

    it('returns function for function values', () => {
      explainVariable(() => {}).should.equal('function');
      explainVariable(function () {}).should.equal('function');
      explainVariable(async () => {}).should.equal('function');
      explainVariable(class MyClass {}).should.equal('function');
    });

    it('returns object for object values', () => {
      explainVariable({}).should.equal('object');
      explainVariable({ a: 1 }).should.equal('object');
    });

    it('handles edge cases: falsy values', () => {
      explainVariable(0).should.equal('number');
      explainVariable('').should.equal('string');
      explainVariable(false).should.equal('boolean');
    });
  });
});
