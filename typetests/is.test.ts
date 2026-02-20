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

describe('isType with array of types', () => {
  it('should narrow unknown to union type', () => {
    const unknownValue: unknown = 'test';

    if (isType(unknownValue, ['string', 'number'])) {
      expect(unknownValue).type.toBe<string | number>();
    }
  });

  it('should narrow unknown to multiple type union', () => {
    const unknownValue: unknown = true;

    if (isType(unknownValue, ['string', 'number', 'boolean'])) {
      expect(unknownValue).type.toBe<string | number | boolean>();
    }
  });

  it('should work with single-element array', () => {
    const unknownValue: unknown = 'test';

    if (isType(unknownValue, ['string'])) {
      expect(unknownValue).type.toBe<string>();
    }
  });

  it('should work with regular array of types', () => {
    const unknownValue: unknown = 42;
    const types: ('string' | 'number')[] = ['string', 'number'];

    if (isType(unknownValue, types)) {
      expect(unknownValue).type.toBe<string | number>();
    }
  });

  it('should raise error for invalid type literal', () => {
    const unknownValue: unknown = 'test';

    expect(isType(unknownValue, 'invalid')).type.toRaiseError();
  });

  it('should raise error for array with invalid type literal', () => {
    const unknownValue: unknown = 42;

    expect(isType(unknownValue, ['string', 'invalid'])).type.toRaiseError();
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
