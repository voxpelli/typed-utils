import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getObjectValueByPath, getStringValueByPath, getValueByPath } from '../lib/object-path.js';

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

      assert.deepStrictEqual(result, { bcd: 'test' });
    });

    it('should get object value by array path', () => {
      const result = getObjectValueByPath(referenceObject(), ['foo', 'xyz']);

      assert.deepStrictEqual(result, { bcd: 'test' });
    });

    it('should return false when value is not an object', () => {
      const result = getObjectValueByPath(referenceObject(), 'foo.bar');

      assert.strictEqual(result, false);
    });

    it('should return undefined when value path does not exist', () => {
      const result = getObjectValueByPath(referenceObject(), 'foo.nonexisting');

      assert.strictEqual(result, undefined);
    });

    it('should return false when sent in object is not an object', () => {
      const result = getObjectValueByPath(true, 'foo.nonexisting');

      assert.strictEqual(result, false);
    });

    it('should return undefined when empty path', () => {
      const result = getObjectValueByPath(referenceObject(), '');

      assert.strictEqual(result, undefined);
    });

    it('should throw on prototype pollution', () => {
      for (const key of ['__proto__', 'constructor', 'prototype']) {
        assert.throws(() => {
          getObjectValueByPath(referenceObject(), `foo.${key}`);
        }, (err) => err instanceof Error && err.message.includes(`Do not include "${key}" in your path`));
        assert.throws(() => {
          getObjectValueByPath(referenceObject(), key);
        }, (err) => err instanceof Error && err.message.includes(`Do not include "${key}" in your path`));
        assert.throws(() => {
          getObjectValueByPath(referenceObject(), `foo.${key}`, true);
        }, (err) => err instanceof Error && err.message.includes(`Do not include "${key}" in your path`));
      }
    });

    it('should return new object at path if value does not exist', () => {
      const obj = referenceObject();

      const result = getObjectValueByPath(obj, 'foo.added');
      assert.strictEqual(result, undefined);

      assert.deepStrictEqual(obj, referenceObject());

      const result2 = getObjectValueByPath(obj, 'foo.added', true);
      assert.deepStrictEqual(result2, {});
      assert.deepStrictEqual(obj, {
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

      assert.strictEqual(result, 'test');
    });

    it('should get string value by array path', () => {
      const result = getStringValueByPath(referenceObject(), ['foo', 'xyz', 'bcd']);

      assert.strictEqual(result, 'test');
    });

    it('should get string value by single segment path', () => {
      const result = getStringValueByPath(referenceObject(), 'cde');

      assert.strictEqual(result, 'yay');
    });

    it('should return empty string', () => {
      const result = getStringValueByPath(referenceObject(), 'def');

      assert.strictEqual(result, '');
    });

    it('should return false when value is not a string', () => {
      const result = getStringValueByPath(referenceObject(), 'foo.bar');

      assert.strictEqual(result, false);
    });

    it('should return false when value is an object', () => {
      const result = getStringValueByPath(referenceObject(), 'foo.xyz');

      assert.strictEqual(result, false);
    });

    it('should return false when path is not an object all the way', () => {
      const result = getStringValueByPath(referenceObject(), 'foo.bar.xyz');

      assert.strictEqual(result, false);
    });

    it('should return undefined when value path does not exist', () => {
      const result = getStringValueByPath(referenceObject(), 'foo.nonexisting');

      assert.strictEqual(result, undefined);
    });

    it('should return undefined when empty path', () => {
      const result = getStringValueByPath(referenceObject(), '');

      assert.strictEqual(result, undefined);
    });

    it('should return false when sent in value is not an object', () => {
      const result = getStringValueByPath(true, 'foo.nonexisting');

      assert.strictEqual(result, false);
    });

    it('should throw on prototype pollution', () => {
      for (const key of ['__proto__', 'constructor', 'prototype']) {
        assert.throws(() => {
          getStringValueByPath(referenceObject(), `foo.${key}`);
        }, (err) => err instanceof Error && err.message.includes(`Do not include "${key}" in your path`));
        assert.throws(() => {
          getStringValueByPath(referenceObject(), key);
        }, (err) => err instanceof Error && err.message.includes(`Do not include "${key}" in your path`));
      }
    });
  });

  describe('getValueByPath()', () => {
    it('should get value by key path', () => {
      const result = getValueByPath(referenceObject(), 'foo.bar');

      assert.deepStrictEqual(result, { value: 123 });
    });

    it('should get value by array path', () => {
      const result = getValueByPath(referenceObject(), ['foo', 'bar']);

      assert.deepStrictEqual(result, { value: 123 });
    });

    it('should resolve empty strings', () => {
      const result = getValueByPath(referenceObject(), 'def');

      assert.deepStrictEqual(result, { value: '' });
    });

    it('should resolve null', () => {
      const result = getValueByPath(referenceObject(), 'efg');

      // eslint-disable-next-line unicorn/no-null
      assert.deepStrictEqual(result, { value: null });
    });
  });
});
