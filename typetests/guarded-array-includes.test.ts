import { describe, it, expect } from 'tstyche';

import { guardedArrayIncludes } from '../lib/array.js';

describe('guardedArrayIncludes', () => {
  it('should narrow unknown value in array of union type', () => {
    const values: (string | number)[] = ['a', 1, 'b'];
    const searchValues: unknown = 'a';

    if (guardedArrayIncludes(values, searchValues)) {
      expect(searchValues).type.toBe<string | number>();
      expect(values).type.toBe<(string | number)[]>();
    }
  });

  it('should narrow unknown value in Set', () => {
    const set: Set<string | number> = new Set(['x', 2]);
    const searchSet: unknown = 'x';

    if (guardedArrayIncludes(set, searchSet)) {
      expect(searchSet).type.toBe<string | number>();
      expect(set).type.toBe<Set<string | number>>();
    }
  });

  it('should narrow unknown value in union of Set and Array', () => {
    const union = Math.random() > 0.5 ? [5] : new Set(['z']);
    const searchUnion: unknown = 'z';

    if (guardedArrayIncludes(union, searchUnion)) {
      expect(searchUnion).type.toBe<string | number>();
      expect(union).type.toBe<number[] | Set<string>>();
    }
  });

  it('should narrow unknown value against number array', () => {
    const onlyNumbers: number[] = [1, 2, 3];
    const unknownSearch: unknown = 2;

    if (guardedArrayIncludes(onlyNumbers, unknownSearch)) {
      expect(unknownSearch).type.toBe<number>();
    }
  });

  it('should work with readonly tuple', () => {
    const readonlyArray: readonly ['foo', 'bar'] = ['foo', 'bar'];
    const searchReadonly: unknown = 'foo';

    if (guardedArrayIncludes(readonlyArray, searchReadonly)) {
      expect(searchReadonly).type.toBe<'foo' | 'bar'>();
      expect(readonlyArray).type.toBe<readonly ['foo', 'bar']>();
    }
  });
});
