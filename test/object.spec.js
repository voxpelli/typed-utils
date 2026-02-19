/* eslint-disable unicorn/no-null, unicorn/no-useless-undefined */
import chai from 'chai';

import {
  omit,
  pick,
  typedObjectKeys,
  typedObjectKeysAll,
  hasOwn,
  hasOwnAll,
} from '../lib/object.js';

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
        .should.eql(referenceObject)     // deep equal: same values
        .but.not.equal(referenceObject); // not the same object reference (.but is a readable alias for .and)
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
        .should.eql(referenceObject)     // deep equal: same values
        .but.not.equal(referenceObject); // not the same object reference (.but is a readable alias for .and)
    });
  });

  describe('typedObjectKeys()', () => {
    it('should return all keys of an object', () => {
      typedObjectKeys(referenceObject).should.have.members(['abc', 'def', 'xyz']);
    });

    it('should return an empty array for empty objects', () => {
      typedObjectKeys({}).should.eql([]);
    });
  });

  describe('typedObjectKeysAll()', () => {
    it('should return all keys of an object', () => {
      typedObjectKeysAll(referenceObject).should.have.members(['abc', 'def', 'xyz']);
    });

    it('should return an empty array for empty objects', () => {
      typedObjectKeysAll({}).should.eql([]);
    });
  });

  describe('hasOwn()', () => {
    it('should return true when key is an own property', () => {
      hasOwn(referenceObject, 'abc').should.be.ok;
      hasOwn(referenceObject, 'def').should.be.ok;
    });

    it('should return false when key is not an own property', () => {
      hasOwn(referenceObject, 'missing').should.not.be.ok;
    });

    it('should return false for non-PropertyKey values', () => {
      hasOwn(referenceObject, {}).should.not.be.ok;
      hasOwn(referenceObject, null).should.not.be.ok;
      hasOwn(referenceObject, undefined).should.not.be.ok;
    });
  });

  describe('hasOwnAll()', () => {
    it('should return true when key is an own property', () => {
      hasOwnAll(referenceObject, 'abc').should.be.ok;
    });

    it('should return false when key is not an own property', () => {
      hasOwnAll(referenceObject, 'missing').should.not.be.ok;
    });

    it('should return false for non-PropertyKey values', () => {
      hasOwnAll(referenceObject, {}).should.not.be.ok;
    });
  });
});
