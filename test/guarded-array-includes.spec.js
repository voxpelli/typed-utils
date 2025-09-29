import chai from 'chai';

import { guardedArrayIncludes } from '../lib/array.js';
import { FrozenSet } from '../lib/set.js';

function * sampleGen () { yield 1; yield 2; }

const should = chai.should();

describe('guardedArrayIncludes()', () => {
  it('should work on a basic array', () => {
    const arr = [1, 2, 3];
    guardedArrayIncludes(arr, 2).should.equal(true);
    guardedArrayIncludes(arr, 4).should.equal(false);
  });

  it('should work on a readonly (const) array / tuple', () => {
    const tuple = /** @type {const} */ (['a', 'b', 'c']);
    guardedArrayIncludes(tuple, 'a').should.equal(true);
    guardedArrayIncludes(tuple, 'd').should.equal(false);
  });

  it('should work on a Set', () => {
    const set = new Set(['x', 'y']);
    guardedArrayIncludes(set, 'x').should.equal(true);
    guardedArrayIncludes(set, 'z').should.equal(false);
  });

  it('should work on a FrozenSet', () => {
    const set = new FrozenSet(['alpha', 'beta']);
    guardedArrayIncludes(set, 'alpha').should.equal(true);
    guardedArrayIncludes(set, 'gamma').should.equal(false);
  });

  it('should work on a Set of objects (identity semantics)', () => {
    const foo = { foo: true };
    const bar = { bar: true };
    const set = new Set([foo]);
    guardedArrayIncludes(set, foo).should.equal(true);
    guardedArrayIncludes(set, bar).should.equal(false);
  });

  describe('unsupported', () => {
    it('should throw on unsupported string collection', () => {
      should.Throw(() => {
        // @ts-expect-error unsupported string collection
        guardedArrayIncludes('abc', 10);
      }, TypeError, 'Invalid collection type');
    });

    it('should throw on unsupported typed array', () => {
      const ta = new Uint8Array([5, 10, 15]);

      should.Throw(() => {
        // @ts-expect-error unsupported typed array
        guardedArrayIncludes(ta, 10);
      }, TypeError, 'Invalid collection type');
    });

    it('should throw on arguments object', () => {
      should.Throw(function () {
        // @ts-expect-error "arguments" are currently unsupported
        guardedArrayIncludes(arguments, 2);
      }, TypeError, 'Invalid collection type');
    });

    it('should throw on Map (unsupported collection type)', () => {
      const map = new Map([['a', 1]]);

      should.Throw(() => {
        // @ts-expect-error unsupported collection type
        guardedArrayIncludes(map, 10);
      }, TypeError, 'Invalid collection type');
    });

    it('should throw on generic iterable (generator)', () => {
      const iterable = sampleGen();

      should.Throw(() => {
        // @ts-expect-error unsupported collection type
        guardedArrayIncludes(iterable, 10);
      }, TypeError, 'Invalid collection type');
    });
  });
});
