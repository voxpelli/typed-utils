import chai from 'chai';

import {
  getObjectValueByPath,
  getStringValueByPath,
  getValueByPath,
  isObjectWithPath,
  isPathWithType,
  isPathWithValue,
} from '../lib/object-path.js';
import {
  assertObjectWithPath,
  assertPathWithType,
  assertPathWithValue,
  TypeHelpersAssertionError,
} from '../lib/assert.js';

const should = chai.should();
const { expect } = chai;

const referenceObject = () => ({
  foo: {
    bar: 123,
    xyz: { bcd: 'test' },
  },
  abc: true,
  cde: 'yay',
  def: '',
  // eslint-disable-next-line unicorn/no-null
  efg: null,
});

describe('object path helpers', () => {
  describe('getObjectValueByPath()', () => {
    it('should get object value by key path', () => {
      const result = getObjectValueByPath(referenceObject(), 'foo.xyz');

      should.exist(result);

      result?.should.deep.equal({ bcd: 'test' });
    });

    it('should get object value by array path', () => {
      const result = getObjectValueByPath(referenceObject(), ['foo', 'xyz']);

      should.exist(result);

      result?.should.deep.equal({ bcd: 'test' });
    });

    it('should return false when value is not an object', () => {
      const result = getObjectValueByPath(referenceObject(), 'foo.bar');

      should.exist(result);

      result?.should.equal(false);
    });

    it('should return undefined when value path does not exist', () => {
      const result = getObjectValueByPath(referenceObject(), 'foo.nonexisting');

      should.not.exist(result);
    });

    it('should return false when sent in object is not an object', () => {
      const result = getObjectValueByPath(true, 'foo.nonexisting');

      should.exist(result);

      result?.should.equal(false);
    });

    it('should return undefined when empty path', () => {
      const result = getObjectValueByPath(referenceObject(), '');

      should.not.exist(result);
    });

    it('should throw on prototype pollution', () => {
      for (const key of ['__proto__', 'constructor', 'prototype']) {
        should.Throw(() => {
          getObjectValueByPath(referenceObject(), `foo.${key}`);
        }, `Do not include "${key}" in your path`);
        should.Throw(() => {
          getObjectValueByPath(referenceObject(), key);
        }, `Do not include "${key}" in your path`);
        should.Throw(() => {
          getObjectValueByPath(referenceObject(), `foo.${key}`, true);
        }, `Do not include "${key}" in your path`);
      }
    });

    it('should return new object at path if value does not exist', () => {
      const obj = referenceObject();

      const result = getObjectValueByPath(obj, 'foo.added');
      should.not.exist(result);

      obj.should.deep.equal(referenceObject());

      const result2 = getObjectValueByPath(obj, 'foo.added', true);
      should.exist(result2);
      result2.should.deep.equal({});
      obj.should.deep.equal({
        ...referenceObject(),
        foo: {
          ...referenceObject().foo,
          added: {},
        },
      });
    });
  });

  describe('getStringValueByPath()', () => {
    it('should get string value by key path', () => {
      const result = getStringValueByPath(referenceObject(), 'foo.xyz.bcd');

      should.exist(result);

      result?.should.equal('test');
    });

    it('should get string value by array path', () => {
      const result = getStringValueByPath(referenceObject(), ['foo', 'xyz', 'bcd']);

      should.exist(result);

      result?.should.deep.equal('test');
    });

    it('should get string value by single segment path', () => {
      const result = getStringValueByPath(referenceObject(), 'cde');

      should.exist(result);

      result?.should.equal('yay');
    });

    it('should return empty string', () => {
      const result = getStringValueByPath(referenceObject(), 'def');

      should.exist(result);

      result?.should.equal('');
    });

    it('should return false when value is not a string', () => {
      const result = getStringValueByPath(referenceObject(), 'foo.bar');

      should.exist(result);

      result?.should.equal(false);
    });

    it('should return false when value is an object', () => {
      const result = getStringValueByPath(referenceObject(), 'foo.xyz');

      should.exist(result);

      result?.should.equal(false);
    });

    it('should return false when path is not an object all the way', () => {
      const result = getStringValueByPath(referenceObject(), 'foo.bar.xyz');

      should.exist(result);

      result?.should.equal(false);
    });

    it('should return undefined when value path does not exist', () => {
      const result = getStringValueByPath(referenceObject(), 'foo.nonexisting');

      should.not.exist(result);
    });

    it('should return undefined when empty path', () => {
      const result = getStringValueByPath(referenceObject(), '');

      should.not.exist(result);
    });

    it('should return false when sent in value is not an object', () => {
      const result = getStringValueByPath(true, 'foo.nonexisting');

      should.exist(result);

      result?.should.equal(false);
    });

    it('should throw on prototype pollution', () => {
      for (const key of ['__proto__', 'constructor', 'prototype']) {
        should.Throw(() => {
          getStringValueByPath(referenceObject(), `foo.${key}`);
        }, `Do not include "${key}" in your path`);
        should.Throw(() => {
          getStringValueByPath(referenceObject(), key);
        }, `Do not include "${key}" in your path`);
      }
    });
  });

  describe('getValueByPath()', () => {
    it('should get value by key path', () => {
      const result = getValueByPath(referenceObject(), 'foo.bar');

      should.exist(result);

      result?.should.deep.equal({ value: 123 });
    });

    it('should get value by array path', () => {
      const result = getValueByPath(referenceObject(), ['foo', 'bar']);

      should.exist(result);

      result?.should.deep.equal({ value: 123 });
    });

    it('should resolve empty strings', () => {
      const result = getValueByPath(referenceObject(), 'def');

      should.exist(result);

      result?.should.deep.equal({ value: '' });
    });

    it('should resolve null', () => {
      const result = getValueByPath(referenceObject(), 'efg');

      should.exist(result);

      // eslint-disable-next-line unicorn/no-null
      result?.should.deep.equal({ value: null });
    });
  });

  describe('isObjectWithPath()', () => {
    it('should return true when path exists and is an object', () => {
      expect(isObjectWithPath(referenceObject(), 'foo')).to.equal(true);
      expect(isObjectWithPath(referenceObject(), 'foo.xyz')).to.equal(true);
      expect(isObjectWithPath(referenceObject(), ['foo', 'xyz'])).to.equal(true);
    });

    it('should return false when path value is not an object', () => {
      expect(isObjectWithPath(referenceObject(), 'foo.bar')).to.equal(false);
      expect(isObjectWithPath(referenceObject(), 'cde')).to.equal(false);
    });

    it('should return false when path does not exist', () => {
      expect(isObjectWithPath(referenceObject(), 'foo.nonexisting')).to.equal(false);
      expect(isObjectWithPath(referenceObject(), 'nonexisting')).to.equal(false);
    });

    it('should return false when sent in value is not an object', () => {
      expect(isObjectWithPath(true, 'foo')).to.equal(false);
      expect(isObjectWithPath('string', 'foo')).to.equal(false);
    });
  });

  describe('isPathWithType()', () => {
    it('should return true when path exists with correct type', () => {
      expect(isPathWithType(referenceObject(), 'foo.bar', 'number')).to.equal(true);
      expect(isPathWithType(referenceObject(), 'cde', 'string')).to.equal(true);
      expect(isPathWithType(referenceObject(), 'abc', 'boolean')).to.equal(true);
      expect(isPathWithType(referenceObject(), 'efg', 'null')).to.equal(true);
      expect(isPathWithType(referenceObject(), ['foo', 'xyz'], 'object')).to.equal(true);
    });

    it('should return false when path exists but has wrong type', () => {
      expect(isPathWithType(referenceObject(), 'foo.bar', 'string')).to.equal(false);
      expect(isPathWithType(referenceObject(), 'cde', 'number')).to.equal(false);
      expect(isPathWithType(referenceObject(), 'abc', 'string')).to.equal(false);
    });

    it('should return false when path does not exist', () => {
      expect(isPathWithType(referenceObject(), 'foo.nonexisting', 'string')).to.equal(false);
      expect(isPathWithType(referenceObject(), 'nonexisting', 'string')).to.equal(false);
    });

    it('should return false when sent in value is not an object', () => {
      expect(isPathWithType(true, 'foo', 'string')).to.equal(false);
      expect(isPathWithType('string', 'foo', 'number')).to.equal(false);
    });
  });

  describe('isPathWithValue()', () => {
    it('should return true when path exists with expected value', () => {
      expect(isPathWithValue(referenceObject(), 'foo.bar', 123)).to.equal(true);
      expect(isPathWithValue(referenceObject(), 'cde', 'yay')).to.equal(true);
      expect(isPathWithValue(referenceObject(), 'abc', true)).to.equal(true);
      expect(isPathWithValue(referenceObject(), 'def', '')).to.equal(true);
      // eslint-disable-next-line unicorn/no-null
      expect(isPathWithValue(referenceObject(), 'efg', null)).to.equal(true);
    });

    it('should return false when path exists but has different value', () => {
      expect(isPathWithValue(referenceObject(), 'foo.bar', 456)).to.equal(false);
      expect(isPathWithValue(referenceObject(), 'cde', 'nay')).to.equal(false);
      expect(isPathWithValue(referenceObject(), 'abc', false)).to.equal(false);
    });

    it('should return false when path does not exist', () => {
      expect(isPathWithValue(referenceObject(), 'foo.nonexisting', 'value')).to.equal(false);
      expect(isPathWithValue(referenceObject(), 'nonexisting', 'value')).to.equal(false);
    });

    it('should return false when sent in value is not an object', () => {
      expect(isPathWithValue(true, 'foo', 'value')).to.equal(false);
      expect(isPathWithValue('string', 'foo', 'value')).to.equal(false);
    });
  });

  describe('assertObjectWithPath()', () => {
    it('should not throw when path exists and is an object', () => {
      expect(() => assertObjectWithPath(referenceObject(), 'foo')).to.not.throw();
      expect(() => assertObjectWithPath(referenceObject(), 'foo.xyz')).to.not.throw();
      expect(() => assertObjectWithPath(referenceObject(), ['foo', 'xyz'])).to.not.throw();
    });

    it('should throw when path value is not an object', () => {
      expect(() => assertObjectWithPath(referenceObject(), 'foo.bar')).to.throw(
        TypeHelpersAssertionError,
        'Expected path "foo.bar" to exist and be an object'
      );
    });

    it('should throw when path does not exist', () => {
      expect(() => assertObjectWithPath(referenceObject(), 'foo.nonexisting')).to.throw(
        TypeHelpersAssertionError,
        'Expected path "foo.nonexisting" to exist and be an object'
      );
    });

    it('should throw when sent in value is not an object', () => {
      expect(() => assertObjectWithPath(true, 'foo')).to.throw(
        TypeHelpersAssertionError,
        'Expected path "foo" to exist and be an object'
      );
    });
  });

  describe('assertPathWithType()', () => {
    it('should not throw when path exists with correct type', () => {
      expect(() => assertPathWithType(referenceObject(), 'foo.bar', 'number')).to.not.throw();
      expect(() => assertPathWithType(referenceObject(), 'cde', 'string')).to.not.throw();
      expect(() => assertPathWithType(referenceObject(), 'abc', 'boolean')).to.not.throw();
      expect(() => assertPathWithType(referenceObject(), ['foo', 'xyz'], 'object')).to.not.throw();
    });

    it('should throw when path exists but has wrong type', () => {
      expect(() => assertPathWithType(referenceObject(), 'foo.bar', 'string')).to.throw(
        TypeHelpersAssertionError,
        'Expected path "foo.bar" to have type "string"'
      );
    });

    it('should throw when path does not exist', () => {
      expect(() => assertPathWithType(referenceObject(), 'foo.nonexisting', 'string')).to.throw(
        TypeHelpersAssertionError,
        'Expected path "foo.nonexisting" to exist'
      );
    });

    it('should throw when sent in value is not an object', () => {
      expect(() => assertPathWithType(true, 'foo', 'string')).to.throw(
        TypeHelpersAssertionError,
        'Expected path "foo" to exist'
      );
    });
  });

  describe('assertPathWithValue()', () => {
    it('should not throw when path exists with expected value', () => {
      expect(() => assertPathWithValue(referenceObject(), 'foo.bar', 123)).to.not.throw();
      expect(() => assertPathWithValue(referenceObject(), 'cde', 'yay')).to.not.throw();
      expect(() => assertPathWithValue(referenceObject(), 'abc', true)).to.not.throw();
    });

    it('should throw when path exists but has different value', () => {
      expect(() => assertPathWithValue(referenceObject(), 'foo.bar', 456)).to.throw(
        TypeHelpersAssertionError,
        'Expected path "foo.bar" to have value 456'
      );
    });

    it('should throw when path does not exist', () => {
      expect(() => assertPathWithValue(referenceObject(), 'foo.nonexisting', 'value')).to.throw(
        TypeHelpersAssertionError,
        'Expected path "foo.nonexisting" to exist'
      );
    });

    it('should throw when sent in value is not an object', () => {
      expect(() => assertPathWithValue(true, 'foo', 'value')).to.throw(
        TypeHelpersAssertionError,
        'Expected path "foo" to exist'
      );
    });
  });
});
