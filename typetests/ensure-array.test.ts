import { describe, expect, test } from 'tstyche';
import { ensureArray } from '../index.js';

describe('ensureArray', () => {
  test('should convert non-array to array', () => {
    const result = ensureArray('single');
    expect(result).type.toBe<string[]>();
  });

  test('should preserve array type', () => {
    const input: string[] = ['already', 'array'];
    const result = ensureArray(input);
    expect(result).type.toBe<string[]>();
  });

  test('should handle union of value and array', () => {
    const input: string | string[] = Math.random() > 0.5 ? 'single' : ['multiple'];
    const result = ensureArray(input);
    expect(result).type.toBe<string[]>();
  });

  test('should handle number types', () => {
    const single = ensureArray(42);
    expect(single).type.toBe<number[]>();

    const arr = ensureArray([1, 2, 3]);
    expect(arr).type.toBe<number[]>();
  });

  test('should handle object types', () => {
    interface User {
      name: string;
      age: number;
    }

    const single: User = { name: 'Alice', age: 30 };
    const result = ensureArray(single);
    expect(result).type.toBe<User[]>();
  });
});
