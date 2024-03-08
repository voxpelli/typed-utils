import chai from 'chai';

import { omit, pick } from '../lib/object.js';

const should = chai.should();

const referenceObject = Object.freeze({
  abc: 123,
  def: 456,
  xyz: 789,
});

describe('object helpers', () => {
  describe('omit()', () => {
    it('should omit specified keys', () => {
      const result = omit(referenceObject, ['abc', 'xyz']);

      should.exist(result);

      result.should.eql({ def: 456 });
    });

    it('should return a new object', () => {
      omit(referenceObject, [])
        .should.eql(referenceObject)
        .but.not.equal(referenceObject);
    });
  });

  describe('pick()', () => {
    it('should pick specified keys', () => {
      const result = pick(referenceObject, ['abc', 'xyz']);

      should.exist(result);

      result.should.eql({ abc: 123, xyz: 789 });
    });

    it('should return a new object', () => {
      pick(referenceObject, ['abc', 'def', 'xyz'])
        .should.eql(referenceObject)
        .but.not.equal(referenceObject);
    });
  });
});
