/* eslint-disable unicorn/no-null */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { filter } from '../lib/array.js';

describe('filter()', () => {
  it('should filter undefined by default', () => {
    /** @type {string[]} */
    const result = filter(['foo', undefined]);
    assert.deepStrictEqual(result, ['foo']);
  });

  it('should filter explicit undefined', () => {
    /** @type {string[]} */
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = filter(['foo', undefined], undefined);
    assert.deepStrictEqual(result, ['foo']);
  });

  it('should filter explicit null', () => {
    /** @type {string[]} */
    const result = filter(['foo', null], null);
    assert.deepStrictEqual(result, ['foo']);
  });

  it('should filter explicit false', () => {
    const input = /** @type {const} */ (['foo', false]);
    /** @type {string[]} */
    const result = filter(input, false);
    assert.deepStrictEqual(result, ['foo']);
  });

  it('should filter explicit string literal', () => {
    const input = /** @type {const} */ (['foo', false]);
    /** @type {false[]} */
    const result = filter(input, 'foo');
    assert.deepStrictEqual(result, [false]);
  });

  it('should not filter anything but a single type at a time', () => {
    const input = /** @type {const} */ (['foo', undefined, null, false]);
    /** @type {(string|false|null)[]} */
    const result = filter(input);
    assert.deepStrictEqual(result, ['foo', null, false]);
  });

  it('should not filter generic string', () => {
    /** @type {string} */
    const filterValue = 'bar';

    let result =
      // @ts-expect-error
      filter(['foo', 'bar'], filterValue);

    assert.deepStrictEqual(result, ['foo']);

    // Should not result in error
    result = ['foo'];
  });
});
