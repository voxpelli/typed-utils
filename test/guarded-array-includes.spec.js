import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { guardedArrayIncludes } from '../lib/array.js';
import { FrozenSet } from '../lib/set.js';

function * sampleGen () { yield 1; yield 2; }

describe('guardedArrayIncludes()', () => {
  it('should work on a basic array', () => {
    const arr = [1, 2, 3];
    assert.strictEqual(guardedArrayIncludes(arr, 2), true);
    assert.strictEqual(guardedArrayIncludes(arr, 4), false);
  });

  it('should work on a readonly (const) array / tuple', () => {
    const tuple = /** @type {const} */ (['a', 'b', 'c']);
    assert.strictEqual(guardedArrayIncludes(tuple, 'a'), true);
    assert.strictEqual(guardedArrayIncludes(tuple, 'd'), false);
  });

  it('should work on a Set', () => {
    const set = new Set(['x', 'y']);
    assert.strictEqual(guardedArrayIncludes(set, 'x'), true);
    assert.strictEqual(guardedArrayIncludes(set, 'z'), false);
  });

  it('should work on a FrozenSet', () => {
    const set = new FrozenSet(['alpha', 'beta']);
    assert.strictEqual(guardedArrayIncludes(set, 'alpha'), true);
    assert.strictEqual(guardedArrayIncludes(set, 'gamma'), false);
  });

  it('should work on a Set of objects (identity semantics)', () => {
    const foo = { foo: true };
    const bar = { bar: true };
    const set = new Set([foo]);
    assert.strictEqual(guardedArrayIncludes(set, foo), true);
    assert.strictEqual(guardedArrayIncludes(set, bar), false);
  });

  describe('unsupported', () => {
    it('should throw on unsupported string collection', () => {
      assert.throws(() => {
        // @ts-expect-error unsupported string collection
        guardedArrayIncludes('abc', 10);
      }, { name: 'TypeError', message: /Invalid collection type/ });
    });

    it('should throw on unsupported typed array', () => {
      const ta = new Uint8Array([5, 10, 15]);

      assert.throws(() => {
        // @ts-expect-error unsupported typed array
        guardedArrayIncludes(ta, 10);
      }, { name: 'TypeError', message: /Invalid collection type/ });
    });

    it('should throw on arguments object', () => {
      assert.throws(function () {
        // @ts-expect-error "arguments" are currently unsupported
        guardedArrayIncludes(arguments, 2);
      }, { name: 'TypeError', message: /Invalid collection type/ });
    });

    it('should throw on Map (unsupported collection type)', () => {
      const map = new Map([['a', 1]]);

      assert.throws(() => {
        // @ts-expect-error unsupported collection type
        guardedArrayIncludes(map, 10);
      }, { name: 'TypeError', message: /Invalid collection type/ });
    });

    it('should throw on generic iterable (generator)', () => {
      const iterable = sampleGen();

      assert.throws(() => {
        // @ts-expect-error unsupported collection type
        guardedArrayIncludes(iterable, 10);
      }, { name: 'TypeError', message: /Invalid collection type/ });
    });
  });
});
