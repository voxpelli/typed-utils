import { describe, it, expect } from 'tstyche';

import { hasOwn, hasOwnAll } from '../lib/object.js';

describe('hasOwn', () => {
  it('should narrow unknown property key in union object', () => {
    const unionObj = {} as (
      { foo: 123; bar: 456 } |
      { foo: 789; abc: 'wow' } |
      { foo: 678; bar: 'foo'; xyz: true }
    );
    const unknownA: PropertyKey = 'foo';

    if (hasOwn(unionObj, unknownA)) {
      expect(unknownA).type.toBe<'foo'>();
    }
  });

  it('should narrow to intersection of keys', () => {
    const unionObj = {} as (
      { foo: 123; bar: 456 } |
      { foo: 789; abc: 'wow' }
    );
    const unknownA: PropertyKey = 'foo';

    if (hasOwn(unionObj, unknownA)) {
      expect(unknownA).type.toBe<'foo'>();
    }
  });
});

describe('hasOwnAll', () => {
  it('should narrow to all keys in union object', () => {
    const unionObj = {} as (
      { foo: 123; bar: 456 } |
      { foo: 789; abc: 'wow' } |
      { foo: 678; bar: 'foo'; xyz: true }
    );
    const unknownA: PropertyKey = 'foo';

    if (hasOwnAll(unionObj, unknownA)) {
      expect(unknownA).type.toBe<'foo' | 'bar' | 'abc' | 'xyz'>();
    }
  });
});
