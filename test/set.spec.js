import chai from 'chai';

import { FrozenSet } from '../lib/set.js';

const should = chai.should();

describe('set helpers', () => {
  describe('FrozenSet', () => {
    it('should work', () => {
      /** @type {FrozenSet<string>} */
      let result;

      should.not.Throw(() => {
        result = new FrozenSet(['abc', '123']);
      });

      should.Throw(() => {
        // @ts-ignore
        result.add('xyz');
      });

      should.Throw(() => {
        // @ts-ignore
        result.delete('abc');
      });

      should.Throw(() => {
        // @ts-ignore
        result.clear();
      });
    });
  });
});
