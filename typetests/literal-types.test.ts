import { describe, it, expect } from 'tstyche';

import type { LiteralTypeOf, LiteralTypes } from '../lib/types/literal-types.d.ts';
import { isType } from '../lib/is.js';
import { assertType } from '../lib/assert.js';
import { assertTypeIsNever } from '../lib/never.js';
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
    expect<LiteralTypes[LiteralTypeOf<{}>]>().type.toBe<object>();
    expect<LiteralTypes[LiteralTypeOf<() => void>]>().type.toBe<(...args: any[]) => unknown>();
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
    const fn: unknown = (() => {}) as (...args: any[]) => unknown;
    const obj: unknown = {};

    if (isType(str, 'string')) expect(str).type.toBe<string>();
    if (isType(num, 'number')) expect(num).type.toBe<number>();
    if (isType(bigintVal, 'bigint')) expect(bigintVal).type.toBe<bigint>();
    if (isType(bool, 'boolean')) expect(bool).type.toBe<boolean>();
    if (isType(sym, 'symbol')) expect(sym).type.toBe<symbol>();
    if (isType(undef, 'undefined')) expect(undef).type.toBe<undefined>();
    if (isType(nul, 'null')) expect(nul).type.toBe<null>();
    if (isType(arr, 'array')) expect(arr).type.toBe<unknown[]>();
    if (isType(fn, 'function')) expect(fn).type.toBe<(...args: any[]) => unknown>();
    if (isType(obj, 'object')) expect(obj).type.toBe<object>();
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
    const fn: unknown = (() => {}) as (...args: any[]) => unknown;
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
    expect(fn).type.toBe<(...args: any[]) => unknown>();

    assertType(obj, 'object');
    expect(obj).type.toBe<object>();
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

// =============================================================================
// Exhaustiveness narrowing tests (issue #81)
//
// CONTEXT: LiteralTypes['object'] was previously mapped to Record<string, unknown>.
// While this was convenient for property access after narrowing, it BROKE
// exhaustiveness checking in the false branch of type guards.
//
// WHY: TypeScript's narrowing algorithm uses type compatibility to determine
// what can be eliminated from the false branch. When a union member like
// `{ kind: string }` is checked against `Record<string, unknown>`, TypeScript
// determines that the member COULD match — but it does NOT eliminate it from
// the false branch. This is because `Record<string, unknown>` is a structural
// type with an index signature, and TypeScript's narrowing is conservative
// about such types.
//
// With `object`, TypeScript DOES eliminate concrete object types from the false
// branch, because `object` is a primitive-excluding type that TypeScript has
// built-in narrowing logic for (similar to `typeof x === 'object'`).
//
// The fix: changing LiteralTypes['object'] from `Record<string, unknown>` to
// `object` restores exhaustiveness behavior.
// =============================================================================
describe('isType exhaustiveness narrowing', () => {
  it('should allow exhaustive narrowing with assertTypeIsNever after checking all types in a union', () => {
    // This is the core regression test for issue #81.
    // A union of string | number | { kind: string } should be fully narrowable
    // using isType guards, leaving `never` in the default branch.
    interface Tagged { kind: string; data: number }
    type MyUnion = string | number | Tagged;

    function exhaustiveCheck (item: MyUnion): string {
      if (isType(item, 'string')) return item;
      if (isType(item, 'number')) return String(item);
      if (isType(item, 'object')) {
        // After all non-object types are excluded, `item` should narrow to `Tagged`
        return item.kind;
      }
      // If exhaustiveness works correctly, `item` is `never` here.
      // With the old Record<string, unknown>, this line would fail because
      // TypeScript couldn't eliminate Tagged from the false branch.
      assertTypeIsNever(item);
      return '';
    }

    expect(exhaustiveCheck).type.toBe<(item: MyUnion) => string>();
  });

  it('should narrow union members to their specific types in the true branch, not to the generic object type', () => {
    // IMPORTANT: When narrowing a union, the true branch should preserve the
    // specific union member type, not widen it to the LiteralTypes entry.
    // For example, `{ kind: string }` should stay `{ kind: string }` in the
    // true branch of isType(x, 'object'), not become `object`.
    interface Specific { kind: string; data: number }
    type MyUnion = string | Specific;

    function checkTrueBranch (item: MyUnion) {
      if (isType(item, 'string')) return;
      if (isType(item, 'object')) {
        // The true branch should preserve the specific type from the union,
        // allowing direct property access without additional type assertions.
        expect(item).type.toBe<Specific>();
        expect(item.kind).type.toBe<string>();
        expect(item.data).type.toBe<number>();
      }
    }

    expect(checkTrueBranch).type.toBe<(item: MyUnion) => void>();
  });

  it('should work with multi-member object unions for exhaustiveness', () => {
    // Exhaustiveness should work even when multiple object types exist in the union.
    // All object-like members should be eliminated from the false branch of
    // isType(x, 'object'), allowing assertTypeIsNever to succeed.
    interface Circle { kind: 'circle'; radius: number }
    interface Square { kind: 'square'; size: number }
    type Shape = string | Circle | Square;

    function processShape (shape: Shape): string {
      if (isType(shape, 'string')) return shape;
      if (isType(shape, 'object')) {
        // Both Circle and Square should be narrowed into the true branch
        return shape.kind;
      }
      assertTypeIsNever(shape);
      return '';
    }

    expect(processShape).type.toBe<(shape: Shape) => string>();
  });

  it('should exhaust all primitive types in a complex union', () => {
    // Verify that isType can exhaust a union containing many different
    // LiteralTypes entries, not just the simple string | number | object case.
    type Complex = string | number | boolean | null | undefined | { x: number };

    function handleComplex (val: Complex): string {
      if (isType(val, 'string')) return val;
      if (isType(val, 'number')) return String(val);
      if (isType(val, 'boolean')) return String(val);
      if (isType(val, 'null')) return 'null';
      if (isType(val, 'undefined')) return 'undefined';
      if (isType(val, 'object')) return String(val.x);
      assertTypeIsNever(val);
      return '';
    }

    expect(handleComplex).type.toBe<(val: Complex) => string>();
  });
});

// =============================================================================
// Function type narrowing tests (issue #83)
//
// CONTEXT: LiteralTypes['function'] was previously mapped to `() => unknown`,
// a zero-argument function type. This caused two problems:
//
// 1. CALL SIGNATURE LOSS: When using isType(x, 'function') on a value with a
//    known callable signature (e.g., `(a: number) => string`), the narrowed
//    type became `() => unknown`, losing all parameter info. By contrast,
//    `typeof x === 'function'` preserves the original call signature because
//    TypeScript has built-in narrowing for `typeof`.
//
// 2. ASSIGNABILITY: Not all functions extend `() => unknown`. Due to TypeScript's
//    parameter contravariance rules, a function like `(a: number) => void` does
//    NOT extend `() => unknown` in strict mode. This means narrowing could be
//    unsound for functions with required parameters.
//
// The fix: `(...args: any[]) => unknown` accepts ALL callable types. We use
// `any[]` for parameters (not `unknown[]`) because of contravariance — a
// function `(a: number) => void` extends `(...args: any[]) => unknown` but
// does NOT extend `(...args: unknown[]) => unknown`.
// =============================================================================
describe('isType function narrowing', () => {
  it('should narrow to the widened function type that accepts any arguments', () => {
    // Verify the base narrowing from unknown produces the correct widened type.
    const fn: unknown = (() => {}) as (...args: any[]) => unknown;

    if (isType(fn, 'function')) {
      expect(fn).type.toBe<(...args: any[]) => unknown>();
    }
  });

  it('should preserve specific callable types from unions, not widen to generic function', () => {
    // When narrowing a union that contains a specific function type,
    // the true branch should preserve that specific type — just like
    // `typeof x === 'function'` does.
    type Callback = (x: number) => string;
    type MaybeCallback = string | Callback;

    function handleCallback (val: MaybeCallback) {
      if (isType(val, 'function')) {
        // The specific `Callback` type should be preserved, not widened to
        // `(...args: any[]) => unknown`. This is the same behavior as typeof.
        expect(val).type.toBe<Callback>();
        // Can call with the original signature
        val(42);
      }
    }

    expect(handleCallback).type.toBe<(val: MaybeCallback) => void>();
  });

  it('should work with assertType for function narrowing', () => {
    const fn: unknown = (() => {}) as (...args: any[]) => unknown;

    assertType(fn, 'function');
    expect(fn).type.toBe<(...args: any[]) => unknown>();
  });
});

// =============================================================================
// LiteralTypeOf ordering tests
//
// CONTEXT: The order of checks in LiteralTypeOf matters because TypeScript
// evaluates conditional types top-down. Functions are objects in JavaScript
// (`typeof (() => {}) === 'function'` but also `(() => {}) instanceof Object`).
// At the type level, `(() => void) extends object` is true.
//
// If the `object` check came BEFORE the `function` check in LiteralTypeOf,
// then `LiteralTypeOf<() => void>` would incorrectly return `'object'`
// instead of `'function'`. The array check must also come before object
// for the same reason (`any[] extends object` is true).
// =============================================================================
describe('LiteralTypeOf ordering', () => {
  it('should identify functions as function, not object', () => {
    // Functions extend `object` at the type level, so the function check
    // must come before the object check in the conditional chain.
    expect<LiteralTypeOf<() => void>>().type.toBe<'function'>();
    expect<LiteralTypeOf<(x: number) => string>>().type.toBe<'function'>();
    expect<LiteralTypeOf<(...args: any[]) => unknown>>().type.toBe<'function'>();
  });

  it('should identify arrays as array, not object', () => {
    // Arrays extend `object` at the type level, so the array check
    // must come before the object check in the conditional chain.
    expect<LiteralTypeOf<[]>>().type.toBe<'array'>();
    expect<LiteralTypeOf<string[]>>().type.toBe<'array'>();
    expect<LiteralTypeOf<[number, string]>>().type.toBe<'array'>();
  });

  it('should identify plain objects as object', () => {
    // Only plain objects (not arrays, not functions) should map to 'object'.
    expect<LiteralTypeOf<{}>>().type.toBe<'object'>();
    expect<LiteralTypeOf<{ key: string }>>().type.toBe<'object'>();
    expect<LiteralTypeOf<Record<string, unknown>>>().type.toBe<'object'>();
  });
});
