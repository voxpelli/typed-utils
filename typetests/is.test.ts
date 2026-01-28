import { describe, it, expect } from 'tstyche';

import {
  isObjectWithKey,
  isKeyWithType,
  isOptionalKeyWithType,
  isType,
} from '../lib/is.js';

describe('isType', () => {
  it('should narrow unknown to object type', () => {
    const unknownValue: unknown = {};

    if (isType(unknownValue, 'object')) {
      expect(unknownValue).type.toBe<Record<string, unknown>>();
    }
  });

  it('should narrow string literal value', () => {
    const value: string = 'foo';

    if (isType(value, typeof value)) {
      expect(value).type.toBe<string>();
    }
  });
});

describe('isObjectWithKey', () => {
  it('should narrow unknown object with specific key', () => {
    const unknownValue: unknown = {};
    const key = 'foo';

    if (isObjectWithKey(unknownValue, key)) {
      expect(unknownValue).type.toBe<Record<'foo', unknown>>();
    }
  });
});

describe('isKeyWithType', () => {
  it('should narrow unknown object with typed key', () => {
    const unknownValue: unknown = {};
    const key = 'foo';

    if (isKeyWithType(unknownValue, key, 'string')) {
      expect(unknownValue).type.toBe<Record<'foo', string>>();
    }
  });

  it('should narrow when key is missing', () => {
    const objWithoutKey1 = { bar: true };

    if (isKeyWithType(objWithoutKey1, 'foo', 'string')) {
      expect(objWithoutKey1).type.toBe<{ bar: boolean } & Record<'foo', string>>();
    }
  });
});

describe('isOptionalKeyWithType', () => {
  it('should narrow unknown object with optional typed key', () => {
    const unknownValue: unknown = {};
    const key = 'foo';

    if (isOptionalKeyWithType(unknownValue, key, 'string')) {
      expect(unknownValue).type.toBe<Partial<Record<'foo', string>>>();
    }
  });

  it('should narrow when optional key is missing', () => {
    const objWithoutKey = { bar: true };

    if (isOptionalKeyWithType(objWithoutKey, 'foo', 'string')) {
      expect(objWithoutKey).type.toBe<{ bar: boolean } & Partial<Record<'foo', string>>>();
    }
  });

  it('should preserve undefined when key is present but undefined', () => {
    const objWithUndefined = { bar: true, foo: undefined };

    if (isOptionalKeyWithType(objWithUndefined, 'foo', 'string')) {
      expect(objWithUndefined).type.toBe<{ bar: boolean; foo: undefined; } & Partial<Record<'foo', string>>>();
    }
  });
});
