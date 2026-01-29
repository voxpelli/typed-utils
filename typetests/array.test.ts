import { describe, it, expect } from 'tstyche';

import { isArrayOfType, isStringArray, typesafeIsArray } from '../lib/array.js';

function isNumber (value: unknown): value is number {
  return typeof value === 'number';
}

describe('isArrayOfType', () => {
  it('should narrow unknown to typed array using predicate', () => {
    const unknownNumberArray: unknown = [123];

    if (isArrayOfType(unknownNumberArray, isNumber)) {
      expect(unknownNumberArray).type.toBe<number[]>();
    }
  });
});

describe('typesafeIsArray', () => {
  it('should narrow Array.isArray to unknown[] instead of any[]', () => {
    const unknownArray: unknown = [];

    if (Array.isArray(unknownArray)) {
      expect(unknownArray).type.toBe<any[]>();
    }

    if (typesafeIsArray(unknownArray)) {
      expect(unknownArray).type.toBe<unknown[]>();
    }
  });
});

describe('isStringArray', () => {
  it('should narrow unknown to string array', () => {
    const unknownStringArray: unknown = ['foo'];

    if (isStringArray(unknownStringArray)) {
      expect(unknownStringArray).type.toBe<string[]>();
    }
  });
});
