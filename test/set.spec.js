import chai from 'chai';

import { FrozenSet } from '../lib/set.js';

chai.should();

describe('set helpers', () => {
  describe('FrozenSet', () => {
    it('should construct from an array', () => {
      (() => new FrozenSet(['abc', '123'])).should.not.throw();
    });

    it('should construct from an empty array', () => {
      const result = new FrozenSet([]);
      result.size.should.equal(0);
    });

    it('should construct from another Set', () => {
      const source = new Set([1, 2, 3]);
      // @ts-ignore — runtime accepts any Iterable; type widened to Iterable<T>
      (() => new FrozenSet(source)).should.not.throw();
    });

    it('should retain initial values', () => {
      const result = new FrozenSet(['abc', '123']);
      result.has('abc').should.equal(true);
      result.has('123').should.equal(true);
      result.size.should.equal(2);
    });

    it('should throw TypeError with correct message when add() is called', () => {
      const result = new FrozenSet(['abc']);
      // @ts-ignore
      (() => result.add('xyz')).should.throw(TypeError, 'Cannot modify frozen set');
    });

    it('should throw TypeError with correct message when delete() is called', () => {
      const result = new FrozenSet(['abc']);
      // @ts-ignore
      (() => result.delete('abc')).should.throw(TypeError, 'Cannot modify frozen set');
    });

    it('should throw TypeError with correct message when clear() is called', () => {
      const result = new FrozenSet(['abc']);
      // @ts-ignore
      (() => result.clear()).should.throw(TypeError, 'Cannot modify frozen set');
    });

    it('should support iteration with for...of', () => {
      [...new FrozenSet(['a', 'b', 'c'])].should.deep.equal(['a', 'b', 'c']);
    });

    it('should support forEach', () => {
      /** @type {string[]} */
      const collected = [];
      // eslint-disable-next-line unicorn/no-array-for-each
      new FrozenSet(['x', 'y']).forEach(v => collected.push(v));
      collected.should.deep.equal(['x', 'y']);
    });
  });
});
