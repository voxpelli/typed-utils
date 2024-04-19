import chai from 'chai';

import { getObjectValueByPath, getStringValueByPath, getValueByPath } from '../lib/object-path.js';

const should = chai.should();

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
});
