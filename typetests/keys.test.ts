import { describe, it, expect } from 'tstyche';

import { typedObjectKeys, typedObjectKeysAll } from '../lib/object.js';

describe('typedObjectKeys', () => {
  it('should return intersection of keys for union object', () => {
    const unionObject = {} as ({ foo: 123; bar: 456 } | { bar: 789; xyz: 'abc' });
    const result = typedObjectKeys(unionObject);

    expect(result).type.toBe<Array<'bar'>>();
  });

  it('should return all keys for basic object', () => {
    const basicObject = { foo: 123, bar: 456 };
    const result = typedObjectKeys(basicObject);

    expect(result).type.toBe<Array<'foo' | 'bar'>>();
  });

  it('should return string[] for generic object', () => {
    const genericObject = {} as Record<string, unknown>;
    const result = typedObjectKeys(genericObject);

    expect(result).type.toBe<string[]>();
  });

  it('should work with readonly const object', () => {
    const readonlyConst = { alpha: 1, beta: 2 } as const;
    const result = typedObjectKeys(readonlyConst);

    expect(result).type.toBe<Array<'alpha' | 'beta'>>();
  });

  it('should handle optional properties', () => {
    const optionalObject = {} as { foo: number; bar?: string };
    const result = typedObjectKeys(optionalObject);

    expect(result).type.toBe<Array<'foo' | 'bar'>>();
  });
});

describe('typedObjectKeysAll', () => {
  it('should return all keys in union object', () => {
    const unionObject = {} as ({ foo: 123; bar: 456 } | { bar: 789; xyz: 'abc' });
    const result = typedObjectKeysAll(unionObject);

    expect(result).type.toBe<Array<'foo' | 'bar' | 'xyz'>>();
  });

  it('should return all keys for basic object', () => {
    const basicObject = { foo: 123, bar: 456 };
    const result = typedObjectKeysAll(basicObject);

    expect(result).type.toBe<Array<'foo' | 'bar'>>();
  });

  it('should return string[] for generic object', () => {
    const genericObject = {} as Record<string, unknown>;
    const result = typedObjectKeysAll(genericObject);

    expect(result).type.toBe<string[]>();
  });

  it('should work with readonly const object', () => {
    const readonlyConst = { alpha: 1, beta: 2 } as const;
    const result = typedObjectKeysAll(readonlyConst);

    expect(result).type.toBe<Array<'alpha' | 'beta'>>();
  });

  it('should handle optional properties in union', () => {
    const optionalUnion = {} as ({ foo?: 1; bar: 2 } | { bar: 2; baz: 3 });
    const result = typedObjectKeysAll(optionalUnion);

    expect(result).type.toBe<Array<'foo' | 'bar' | 'baz'>>();
  });

  it('should handle union with generic-like record', () => {
    const genericUnion = {} as ({ a: number; b: number } | Record<string, number>);
    const result = typedObjectKeysAll(genericUnion);

    expect(result).type.toBe<string[]>();
  });
});
