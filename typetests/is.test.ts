import { describe, it, expect } from 'tstyche';

import {
  isObject,
  isObjectWithKey,
  isKeyWithType,
  isOptionalKeyWithType,
  isType,
} from '../lib/is.js';
import { assertTypeIsNever } from '../lib/never.js';

describe('isType', () => {
  it('should narrow unknown to object type', () => {
    const unknownValue: unknown = {};

    if (isType(unknownValue, 'object')) {
      expect(unknownValue).type.toBe<object>();
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

// =============================================================================
// isObject tests
//
// CONTEXT: isObject was added as a migration path when LiteralTypes['object']
// was changed from Record<string, unknown> to object (issue #81).
//
// WHY it exists: isType(x, 'object') now narrows to `object`, which does NOT
// have an index signature — you can't do `x['key']` on an `object`. For users
// who need Record<string, unknown> narrowing (e.g., for indexed property access
// or `'key' in x` patterns), `isObject` provides that. It's the guard equivalent
// of the existing `assertObject()` assertion helper.
//
// WHY NOT just keep Record<string, unknown> in LiteralTypes? Because it breaks
// exhaustiveness narrowing — TypeScript can't eliminate union members from the
// false branch when the guard type is Record<string, unknown>. See issue #81
// and the exhaustiveness tests in literal-types.test.ts for details.
// =============================================================================
describe('isObject', () => {
  it('should narrow unknown to Record<string, unknown> — the indexed-access-friendly type', () => {
    // This is the main value proposition of isObject: you get Record<string, unknown>
    // which allows bracket-access and `'key' in obj` patterns.
    const value: unknown = {};

    if (isObject(value)) {
      expect(value).type.toBe<Record<string, unknown>>();
    }
  });

  it('should intersect with the original type when used on a union', () => {
    // IMPORTANT: Unlike the generic `isType(x, 'object')`, the non-generic
    // `isObject(x)` does NOT preserve specific union member types. It
    // intersects the original type with Record<string, unknown>.
    //
    // TypeScript's narrowing for `value is T` produces `OriginalType & T`,
    // so isObject(val) on `string | Config` gives `(string | Config) & Record<string, unknown>`.
    //
    // Use `isType(x, 'object')` when narrowing unions and you need the
    // specific member type. Use `isObject(x)` when starting from `unknown`
    // and you need indexed property access.
    interface Config { port: number; host: string }
    type Input = string | Config;

    function handle (val: Input) {
      if (isObject(val)) {
        // TypeScript intersects the union with Record<string, unknown>
        expect(val).type.toBe<Input & Record<string, unknown>>();
      }
    }

    expect(handle).type.toBe<(val: Input) => void>();
  });

  it('should contrast with isType which preserves specific union member types', () => {
    // This test documents the key difference between isObject and isType:
    // isType(x, 'object') preserves specific union members because it uses
    // a generic type parameter. isObject intersects with Record<string, unknown>.
    interface Config { port: number; host: string }
    type Input = string | Config;

    function handleWithIsType (val: Input) {
      if (isType(val, 'object')) {
        // isType preserves the specific Config type from the union
        expect(val).type.toBe<Config>();
        expect(val.port).type.toBe<number>();
      }
    }

    function handleWithIsObject (val: Input) {
      if (isObject(val)) {
        // isObject intersects with Record<string, unknown>
        expect(val).type.toBe<Input & Record<string, unknown>>();
      }
    }

    expect(handleWithIsType).type.toBe<(val: Input) => void>();
    expect(handleWithIsObject).type.toBe<(val: Input) => void>();
  });
});

// =============================================================================
// isType exhaustiveness tests (issue #81 — is.test.ts perspective)
//
// These tests verify that isType-based narrowing eliminates types correctly
// from the false branch, enabling assertTypeIsNever to work.
//
// The issue: with Record<string, unknown> as the LiteralTypes['object'] entry,
// TypeScript's narrowing algorithm would NOT eliminate concrete object types
// (like `{ kind: string }`) from the false branch of `isType(x, 'object')`.
// This is because TypeScript is conservative about index-signature types —
// even though `{ kind: string } extends Record<string, unknown>` is true at
// the type level, TypeScript's control flow analysis does not treat this as
// sufficient to remove the type from the false branch.
//
// With `object` as the LiteralTypes['object'] entry, TypeScript DOES eliminate
// concrete object types from the false branch, because `object` is a
// primitive-excluding type that has special built-in narrowing behavior.
// =============================================================================
describe('isType exhaustive narrowing with assertTypeIsNever', () => {
  it('should allow assertTypeIsNever after exhausting a string | object union', () => {
    // Simplest possible regression test for issue #81.
    interface Data { value: number }
    type Input = string | Data;

    function process (item: Input): string {
      if (isType(item, 'string')) return item;
      if (isType(item, 'object')) return String(item.value);
      // With old Record<string, unknown>, this would error because Data
      // was not eliminated from the false branch.
      assertTypeIsNever(item);
      return '';
    }

    expect(process).type.toBe<(item: Input) => string>();
  });

  it('should allow assertTypeIsNever after exhausting a multi-primitive + object union', () => {
    interface Payload { type: string }
    type Value = string | number | boolean | Payload;

    function stringify (val: Value): string {
      if (isType(val, 'string')) return val;
      if (isType(val, 'number')) return String(val);
      if (isType(val, 'boolean')) return String(val);
      if (isType(val, 'object')) return val.type;
      assertTypeIsNever(val);
      return '';
    }

    expect(stringify).type.toBe<(val: Value) => string>();
  });

  it('should allow assertTypeIsNever after exhausting a union with null and undefined', () => {
    // Null and undefined are special cases in LiteralTypes — they don't use
    // typeof directly and need custom runtime checks. Verify they participate
    // correctly in exhaustiveness chains.
    interface Options { debug: boolean }
    type Nullable = string | null | undefined | Options;

    function handle (val: Nullable): string {
      if (isType(val, 'string')) return val;
      if (isType(val, 'null')) return 'null';
      if (isType(val, 'undefined')) return 'undefined';
      if (isType(val, 'object')) return String(val.debug);
      assertTypeIsNever(val);
      return '';
    }

    expect(handle).type.toBe<(val: Nullable) => string>();
  });

  it('should allow assertTypeIsNever after exhausting a union with array members', () => {
    // Arrays are a special case: they extend `object` at the type level, but
    // LiteralTypes has a separate 'array' entry checked before 'object'.
    // This test verifies that both 'array' and 'object' narrowing work together
    // for exhaustiveness.
    interface Config { name: string }
    type Input = string | string[] | Config;

    function process (val: Input): string {
      if (isType(val, 'string')) return val;
      if (isType(val, 'array')) return val.join(', ');
      if (isType(val, 'object')) return val.name;
      assertTypeIsNever(val);
      return '';
    }

    expect(process).type.toBe<(val: Input) => string>();
  });
});
