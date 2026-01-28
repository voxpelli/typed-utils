import { describe, it, expect } from 'tstyche';

import type { LiteralTypeOf, LiteralTypes } from '../lib/types/literal-types.d.ts';

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
