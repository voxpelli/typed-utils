/* eslint-disable unicorn/no-null */
import chai from 'chai';

import { filter } from '../index.js';

chai.should();

describe('filter()', () => {
  it('should filter undefined by default', () => {
    /** @type {string[]} */
    const result = filter(['foo', undefined]);
    result.should.deep.equal(['foo']);
  });

  it('should filter explicit undefined', () => {
    /** @type {string[]} */
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = filter(['foo', undefined], undefined);
    result.should.deep.equal(['foo']);
  });

  it('should filter explicit null', () => {
    /** @type {string[]} */
    const result = filter(['foo', null], null);
    result.should.deep.equal(['foo']);
  });

  it('should filter explicit false', () => {
    const input = /** @type {const} */ (['foo', false]);
    /** @type {string[]} */
    const result = filter(input, false);
    result.should.deep.equal(['foo']);
  });

  it('should not filter anything but a single type at a time', () => {
    const input = /** @type {const} */ (['foo', undefined, null, false]);
    /** @type {(string|false|null)[]} */
    const result = filter(input);
    result.should.deep.equal(['foo', null, false]);
  });
});
