import { describe, it, expect } from 'tstyche';

import {
  isObjectWithPath,
  isPathWithType,
  isPathWithValue,
} from '../lib/object-path.js';
import {
  assertObjectWithPath,
  assertPathWithType,
  assertPathWithValue,
} from '../lib/assert.js';

describe('isObjectWithPath', () => {
  it('should narrow unknown to object', () => {
    const unknownValue: unknown = { foo: { bar: {} } };
    const path = 'foo.bar';

    if (isObjectWithPath(unknownValue, path)) {
      expect(unknownValue).type.toBe<Record<string, unknown>>();
    }
  });

  it('should work with array path', () => {
    const unknownValue: unknown = { foo: { bar: {} } };
    const path = ['foo', 'bar'];

    if (isObjectWithPath(unknownValue, path)) {
      expect(unknownValue).type.toBe<Record<string, unknown>>();
    }
  });
});

describe('isPathWithType', () => {
  it('should work with string type', () => {
    const obj: unknown = { foo: { bar: 'test' } };

    const result = isPathWithType(obj, 'foo.bar', 'string');
    expect(result).type.toBe<boolean>();
  });

  it('should work with number type', () => {
    const obj: unknown = { foo: { bar: 123 } };

    const result = isPathWithType(obj, 'foo.bar', 'number');
    expect(result).type.toBe<boolean>();
  });
});

describe('isPathWithValue', () => {
  it('should work with any value', () => {
    const obj: unknown = { foo: { bar: 'test' } };

    const result = isPathWithValue(obj, 'foo.bar', 'test');
    expect(result).type.toBe<boolean>();
  });

  it('should work with numeric value', () => {
    const obj: unknown = { foo: { bar: 123 } };

    const result = isPathWithValue(obj, 'foo.bar', 123);
    expect(result).type.toBe<boolean>();
  });
});

describe('assertObjectWithPath', () => {
  it('should narrow unknown to object', () => {
    const unknownValue: unknown = { foo: { bar: {} } };
    const path = 'foo.bar';

    assertObjectWithPath(unknownValue, path);
    expect(unknownValue).type.toBe<Record<string, unknown>>();
  });

  it('should work with array path', () => {
    const unknownValue: unknown = { foo: { bar: {} } };
    const path = ['foo', 'bar'];

    assertObjectWithPath(unknownValue, path);
    expect(unknownValue).type.toBe<Record<string, unknown>>();
  });
});

describe('assertPathWithType', () => {
  it('should narrow unknown to object', () => {
    const unknownValue: unknown = { foo: { bar: 'test' } };
    const path = 'foo.bar';

    assertPathWithType(unknownValue, path, 'string');
    expect(unknownValue).type.toBe<Record<string, unknown>>();
  });

  it('should work with array path', () => {
    const unknownValue: unknown = { foo: { bar: 123 } };
    const path = ['foo', 'bar'];

    assertPathWithType(unknownValue, path, 'number');
    expect(unknownValue).type.toBe<Record<string, unknown>>();
  });
});

describe('assertPathWithValue', () => {
  it('should narrow unknown to object', () => {
    const unknownValue: unknown = { foo: { bar: 'test' } };
    const path = 'foo.bar';

    assertPathWithValue(unknownValue, path, 'test');
    expect(unknownValue).type.toBe<Record<string, unknown>>();
  });

  it('should work with array path', () => {
    const unknownValue: unknown = { foo: { bar: 123 } };
    const path = ['foo', 'bar'];

    assertPathWithValue(unknownValue, path, 123);
    expect(unknownValue).type.toBe<Record<string, unknown>>();
  });
});
