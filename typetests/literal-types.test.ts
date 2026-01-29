import { describe, it, expect } from 'tstyche';

import type { LiteralTypeOf, LiteralTypes } from '../lib/types/literal-types.d.ts';
import { isType } from '../lib/is.js';
import { assertType } from '../lib/assert.js';
import { explainVariable } from '../lib/misc.js';

describe('LiteralTypeOf', () => {
  it('correctly identifies all core types', () => {
    expect<LiteralTypeOf<'hello'>>().type.toBe<'string'>();
    expect<LiteralTypeOf<42>>().type.toBe<'number'>();
    expect<LiteralTypeOf<42n>>().type.toBe<'bigint'>();
    expect<LiteralTypeOf<true>>().type.toBe<'boolean'>();
    expect<LiteralTypeOf<symbol>>().type.toBe<'symbol'>();
    expect<LiteralTypeOf<undefined>>().type.toBe<'undefined'>();
    expect<LiteralTypeOf<null>>().type.toBe<'null'>();
    expect<LiteralTypeOf<[]>>().type.toBe<'array'>();
    expect<LiteralTypeOf<() => void>>().type.toBe<'function'>();
    expect<LiteralTypeOf<{}>>().type.toBe<'object'>();
  });

  it('handles edge cases: falsy values', () => {
    expect<LiteralTypeOf<0>>().type.toBe<'number'>();
    expect<LiteralTypeOf<''>>().type.toBe<'string'>();
    expect<LiteralTypeOf<false>>().type.toBe<'boolean'>();
  });
});

describe('LiteralTypes', () => {
  it('maps discriminator keys to correct types for all core types', () => {
    expect<LiteralTypes[LiteralTypeOf<'hello'>]>().type.toBe<string>();
    expect<LiteralTypes[LiteralTypeOf<42>]>().type.toBe<number>();
    expect<LiteralTypes[LiteralTypeOf<42n>]>().type.toBe<bigint>();
    expect<LiteralTypes[LiteralTypeOf<true>]>().type.toBe<boolean>();
    expect<LiteralTypes[LiteralTypeOf<symbol>]>().type.toBe<symbol>();
    expect<LiteralTypes[LiteralTypeOf<undefined>]>().type.toBe<undefined>();
    expect<LiteralTypes[LiteralTypeOf<null>]>().type.toBe<null>();
    expect<LiteralTypes[LiteralTypeOf<[]>]>().type.toBe<unknown[]>();
    expect<LiteralTypes[LiteralTypeOf<{}>]>().type.toBe<Record<string, unknown>>();
    expect<LiteralTypes[LiteralTypeOf<() => void>]>().type.toBe<() => unknown>();
  });

  it('maps falsy values correctly', () => {
    expect<LiteralTypes[LiteralTypeOf<0>]>().type.toBe<number>();
    expect<LiteralTypes[LiteralTypeOf<''>]>().type.toBe<string>();
    expect<LiteralTypes[LiteralTypeOf<false>]>().type.toBe<boolean>();
  });
});

describe('isType', () => {
  it('correctly narrows all core types', () => {
    const str: unknown = 'hello';
    const num: unknown = 42;
    const bigintVal: unknown = 42n;
    const bool: unknown = true;
    const sym: unknown = Symbol('test');
    const undef: unknown = undefined;
    // eslint-disable-next-line unicorn/no-null
    const nul: unknown = null;
    const arr: unknown = [];
    const fn: unknown = (() => {}) as () => unknown;
    const obj: unknown = {};

    if (isType(str, 'string')) expect(str).type.toBe<string>();
    if (isType(num, 'number')) expect(num).type.toBe<number>();
    if (isType(bigintVal, 'bigint')) expect(bigintVal).type.toBe<bigint>();
    if (isType(bool, 'boolean')) expect(bool).type.toBe<boolean>();
    if (isType(sym, 'symbol')) expect(sym).type.toBe<symbol>();
    if (isType(undef, 'undefined')) expect(undef).type.toBe<undefined>();
    if (isType(nul, 'null')) expect(nul).type.toBe<null>();
    if (isType(arr, 'array')) expect(arr).type.toBe<unknown[]>();
    if (isType(fn, 'function')) expect(fn).type.toBe<() => unknown>();
    if (isType(obj, 'object')) expect(obj).type.toBe<Record<string, unknown>>();
  });

  it('handles edge cases: falsy values', () => {
    const zero: unknown = 0;
    const emptyString: unknown = '';
    const falseBool: unknown = false;

    if (isType(zero, 'number')) expect(zero).type.toBe<number>();
    if (isType(emptyString, 'string')) expect(emptyString).type.toBe<string>();
    if (isType(falseBool, 'boolean')) expect(falseBool).type.toBe<boolean>();
  });
});

describe('assertType', () => {
  it('correctly narrows all core types', () => {
    const str: unknown = 'hello';
    const num: unknown = 42;
    const bigintVal: unknown = 42n;
    const bool: unknown = true;
    const sym: unknown = Symbol('test');
    const undef: unknown = undefined;
    // eslint-disable-next-line unicorn/no-null
    const nul: unknown = null;
    const arr: unknown = [];
    const fn: unknown = (() => {}) as () => unknown;
    const obj: unknown = {};

    assertType(str, 'string');
    expect(str).type.toBe<string>();

    assertType(num, 'number');
    expect(num).type.toBe<number>();

    assertType(bigintVal, 'bigint');
    expect(bigintVal).type.toBe<bigint>();

    assertType(bool, 'boolean');
    expect(bool).type.toBe<boolean>();

    assertType(sym, 'symbol');
    expect(sym).type.toBe<symbol>();

    assertType(undef, 'undefined');
    expect(undef).type.toBe<undefined>();

    assertType(nul, 'null');
    expect(nul).type.toBe<null>();

    assertType(arr, 'array');
    expect(arr).type.toBe<unknown[]>();

    assertType(fn, 'function');
    expect(fn).type.toBe<() => unknown>();

    assertType(obj, 'object');
    expect(obj).type.toBe<Record<string, unknown>>();
  });

  it('handles edge cases: falsy values', () => {
    const zero: unknown = 0;
    const emptyString: unknown = '';
    const falseBool: unknown = false;

    assertType(zero, 'number');
    expect(zero).type.toBe<number>();

    assertType(emptyString, 'string');
    expect(emptyString).type.toBe<string>();

    assertType(falseBool, 'boolean');
    expect(falseBool).type.toBe<boolean>();
  });
});

describe('explainVariable', () => {
  it('correctly identifies all core types', () => {
    const str = 'hello';
    const num = 42;
    const bigintVal = 42n;
    const bool = true;
    const sym = Symbol('test');
    const undef = undefined;
    // eslint-disable-next-line unicorn/no-null
    const nul = null;
    const arr: unknown[] = [];
    const fn = (() => {}) as () => unknown;
    const obj = {};

    expect(explainVariable(str)).type.toBe<LiteralTypeOf<typeof str>>();
    expect(explainVariable(num)).type.toBe<LiteralTypeOf<typeof num>>();
    expect(explainVariable(bigintVal)).type.toBe<LiteralTypeOf<typeof bigintVal>>();
    expect(explainVariable(bool)).type.toBe<LiteralTypeOf<typeof bool>>();
    expect(explainVariable(sym)).type.toBe<LiteralTypeOf<typeof sym>>();
    expect(explainVariable(undef)).type.toBe<LiteralTypeOf<typeof undef>>();
    expect(explainVariable(nul)).type.toBe<LiteralTypeOf<typeof nul>>();
    expect(explainVariable(arr)).type.toBe<LiteralTypeOf<typeof arr>>();
    expect(explainVariable(fn)).type.toBe<LiteralTypeOf<typeof fn>>();
    expect(explainVariable(obj)).type.toBe<LiteralTypeOf<typeof obj>>();
  });

  it('handles edge cases: falsy values', () => {
    const zero = 0;
    const emptyString = '';
    const falseBool = false;

    expect(explainVariable(zero)).type.toBe<LiteralTypeOf<typeof zero>>();
    expect(explainVariable(emptyString)).type.toBe<LiteralTypeOf<typeof emptyString>>();
    expect(explainVariable(falseBool)).type.toBe<LiteralTypeOf<typeof falseBool>>();
  });
});
