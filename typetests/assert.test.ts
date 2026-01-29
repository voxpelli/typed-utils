import { describe, it, expect } from 'tstyche';

import {
  assertArrayOfLiteralType,
  assertKeyWithType,
  assertObjectValueType,
  assertObjectWithKey,
  assertOptionalKeyWithType,
  assertType,
} from '../lib/assert.js';

describe('assertType', () => {
  it('should narrow unknown to object type', () => {
    const unknownValue: unknown = {};

    assertType(unknownValue, 'object');
    expect(unknownValue).type.toBe<Record<string, unknown>>();
  });

  it('should narrow string value', () => {
    const value: string = 'foo';

    assertType(value, typeof value);
    expect(value).type.toBe<string>();
  });
});

describe('assertObjectWithKey', () => {
  it('should narrow unknown object with specific key', () => {
    const unknownValue: unknown = {};
    const key = 'foo';

    assertObjectWithKey(unknownValue, key);
    expect(unknownValue).type.toBe<Record<'foo', unknown>>();
  });
});

describe('assertKeyWithType', () => {
  it('should narrow unknown object with typed key', () => {
    const unknownValue: unknown = {};
    const key = 'foo';

    assertKeyWithType(unknownValue, key, 'string');
    expect(unknownValue).type.toBe<Record<'foo', string>>();
  });

  it('should add typed key when key is missing', () => {
    const objWithoutKey1 = { bar: true };

    assertKeyWithType(objWithoutKey1, 'foo', 'string');
    expect(objWithoutKey1).type.toBe<{ bar: boolean } & Record<'foo', string>>();
  });
});

describe('assertOptionalKeyWithType', () => {
  it('should narrow unknown object with optional typed key', () => {
    const unknownValue5: unknown = {};
    const key5 = 'foo';

    assertOptionalKeyWithType(unknownValue5, key5, 'string');
    expect(unknownValue5).type.toBe<Partial<Record<'foo', string>>>();
  });

  it('should add optional typed key when key is missing', () => {
    const objWithoutKey = { bar: true };

    assertOptionalKeyWithType(objWithoutKey, 'foo', 'string');
    expect(objWithoutKey).type.toBe<{ bar: boolean } & Partial<Record<'foo', string>>>();
  });
});

describe('assertArrayOfLiteralType', () => {
  it('should narrow unknown to string array', () => {
    const unknownValue6: unknown = ['foo', 'bar'];

    assertArrayOfLiteralType(unknownValue6, 'string');
    expect(unknownValue6).type.toBe<string[]>();
  });

  it('should narrow unknown to number array', () => {
    const unknownValue7: unknown = [1, 2, 3];

    assertArrayOfLiteralType(unknownValue7, 'number');
    expect(unknownValue7).type.toBe<number[]>();
  });
});

describe('assertObjectValueType', () => {
  it('should narrow unknown to string record', () => {
    const unknownValue8: unknown = { a: 'foo', b: 'bar' };

    assertObjectValueType(unknownValue8, 'string');
    expect(unknownValue8).type.toBe<Record<string, string>>();
  });

  it('should narrow unknown to number record', () => {
    const unknownValue9: unknown = { x: 1, y: 2 };

    assertObjectValueType(unknownValue9, 'number');
    expect(unknownValue9).type.toBe<Record<string, number>>();
  });
});
