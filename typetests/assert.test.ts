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

describe('assertType with array of types', () => {
  it('should narrow unknown to union type', () => {
    const unknownValue: unknown = 'test';

    assertType(unknownValue, ['string', 'number']);
    expect(unknownValue).type.toBe<string | number>();
  });

  it('should narrow unknown to multiple type union', () => {
    const unknownValue: unknown = true;

    assertType(unknownValue, ['string', 'number', 'boolean']);
    expect(unknownValue).type.toBe<string | number | boolean>();
  });

  it('should work with single-element array', () => {
    const unknownValue: unknown = 'test';

    assertType(unknownValue, ['string']);
    expect(unknownValue).type.toBe<string>();
  });

  it('should work with regular array of types', () => {
    const unknownValue: unknown = 42;
    const types: ('string' | 'number')[] = ['string', 'number'];

    assertType(unknownValue, types);
    expect(unknownValue).type.toBe<string | number>();
  });

  it('should raise error for invalid type literal', () => {
    const unknownValue: unknown = 'test';

    expect(assertType(unknownValue, 'invalid')).type.toRaiseError();
  });

  it('should raise error for array with invalid type literal', () => {
    const unknownValue: unknown = 42;

    expect(assertType(unknownValue, ['string', 'invalid'])).type.toRaiseError();
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

describe('assertArrayOfLiteralType with array of types', () => {
  it('should narrow unknown to union array', () => {
    const unknownValue: unknown = ['foo', 123, 'bar'];

    assertArrayOfLiteralType(unknownValue, ['string', 'number']);
    expect(unknownValue).type.toBe<Array<string | number>>();
  });

  it('should narrow unknown to multiple type union array', () => {
    const unknownValue: unknown = [true, 42, 'test'];

    assertArrayOfLiteralType(unknownValue, ['boolean', 'number', 'string']);
    expect(unknownValue).type.toBe<Array<boolean | number | string>>();
  });

  it('should work with regular array of types', () => {
    const unknownValue: unknown = [1, 'two'];
    const types: ('string' | 'number')[] = ['string', 'number'];

    assertArrayOfLiteralType(unknownValue, types);
    expect(unknownValue).type.toBe<Array<string | number>>();
  });

  it('should raise error for invalid type literal', () => {
    const unknownValue: unknown = ['foo', 'bar'];

    expect(assertArrayOfLiteralType(unknownValue, 'invalid')).type.toRaiseError();
  });

  it('should raise error for array with invalid type literal', () => {
    const unknownValue: unknown = ['test'];

    expect(assertArrayOfLiteralType(unknownValue, ['string', 'notAType'])).type.toRaiseError();
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

  it('should narrow unknown to union type record with array of types', () => {
    const unknownValue10: unknown = { a: 'foo', b: 123, c: true };

    assertObjectValueType(unknownValue10, ['string', 'number', 'boolean']);
    expect(unknownValue10).type.toBe<Record<string, string | number | boolean>>();
  });

  it('should narrow unknown to string or number record', () => {
    const unknownValue11: unknown = { x: 1, y: 'two' };

    assertObjectValueType(unknownValue11, ['string', 'number']);
    expect(unknownValue11).type.toBe<Record<string, string | number>>();
  });

  it('should work with regular array of types', () => {
    const unknownValue12: unknown = { a: true, b: false };
    const types: ('boolean' | 'number')[] = ['boolean', 'number'];

    assertObjectValueType(unknownValue12, types);
    expect(unknownValue12).type.toBe<Record<string, boolean | number>>();
  });

  it('should raise error for invalid type literal', () => {
    const unknownValue: unknown = { a: 'foo' };

    expect(assertObjectValueType(unknownValue, 'invalid')).type.toRaiseError();
  });

  it('should raise error for array with invalid type literal', () => {
    const unknownValue: unknown = { x: 1, y: 2 };

    expect(assertObjectValueType(unknownValue, ['number', 'invalid'])).type.toRaiseError();
  });
});
