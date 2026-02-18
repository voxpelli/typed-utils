import { describe, it, expect } from 'tstyche';

import {
  isObjectWithPath,
  isPathWithType,
  isPathWithValue,
} from '../lib/object-path.js';
import {
  assertObjectWithPath,
  assertPathWithType,
  assertPathWithValue,
} from '../lib/assert.js';

describe('isObjectWithPath', () => {
  describe('positive cases', () => {
    it('should narrow unknown to object', () => {
      const unknownValue: unknown = { foo: { bar: {} } };
      const path = 'foo.bar';

      if (isObjectWithPath(unknownValue, path)) {
        expect(unknownValue).type.toBe<Record<string, unknown>>();
      }
    });

    it('should preserve original type when using generic overload', () => {
      type TestType = { foo: { bar: { baz: string } } };
      const obj: TestType = { foo: { bar: { baz: 'test' } } };

      if (isObjectWithPath(obj, 'foo.bar')) {
        expect(obj).type.toBe<TestType & Record<string, unknown>>();
      }
    });

    it('should work with array path', () => {
      const unknownValue: unknown = { foo: { bar: {} } };
      const path = ['foo', 'bar'] as const;

      if (isObjectWithPath(unknownValue, path)) {
        expect(unknownValue).type.toBe<Record<string, unknown>>();
      }
    });

    it('should preserve type with array path using generic overload', () => {
      type TestType = { foo: { bar: { baz: number } } };
      const obj: TestType = { foo: { bar: { baz: 42 } } };

      if (isObjectWithPath(obj, ['foo', 'bar'] as const)) {
        expect(obj).type.toBe<TestType & Record<string, unknown>>();
      }
    });

    it('should work with mutable array path', () => {
      type TestType = { foo: { bar: string } };
      const obj: TestType = { foo: { bar: 'test' } };
      const path: string[] = ['foo'];

      if (isObjectWithPath(obj, path)) {
        expect(obj).type.toBe<TestType & Record<string, unknown>>();
      }
    });
  });
});

describe('isPathWithType', () => {
  describe('positive cases', () => {
    it('should narrow unknown to object when type matches', () => {
      const obj: unknown = { foo: { bar: 'test' } };

      if (isPathWithType(obj, 'foo.bar', 'string')) {
        expect(obj).type.toBe<Record<string, unknown>>();
      }
    });

    it('should preserve original type with generic overload', () => {
      type TestType = { foo: { bar: string } };
      const obj: TestType = { foo: { bar: 'test' } };

      if (isPathWithType(obj, 'foo.bar', 'string')) {
        expect(obj).type.toBe<TestType & Record<string, unknown>>();
      }
    });

    it('should work with number type', () => {
      const obj: unknown = { foo: { bar: 123 } };

      if (isPathWithType(obj, 'foo.bar', 'number')) {
        expect(obj).type.toBe<Record<string, unknown>>();
      }
    });

    it('should work with array path', () => {
      const obj: unknown = { foo: { bar: true } };

      if (isPathWithType(obj, ['foo', 'bar'] as const, 'boolean')) {
        expect(obj).type.toBe<Record<string, unknown>>();
      }
    });

    it('should preserve type with array path using generic overload', () => {
      type TestType = { foo: { bar: boolean } };
      const obj: TestType = { foo: { bar: true } };

      if (isPathWithType(obj, ['foo', 'bar'] as const, 'boolean')) {
        expect(obj).type.toBe<TestType & Record<string, unknown>>();
      }
    });

    it('should work with all literal types', () => {
      const obj: unknown = { a: 1, b: '2', c: true, d: undefined, e: undefined, f: [], g: {}, h: () => {} };

      if (isPathWithType(obj, 'a', 'number')) expect(obj).type.toBe<Record<string, unknown>>();
      if (isPathWithType(obj, 'b', 'string')) expect(obj).type.toBe<Record<string, unknown>>();
      if (isPathWithType(obj, 'c', 'boolean')) expect(obj).type.toBe<Record<string, unknown>>();
      if (isPathWithType(obj, 'd', 'null')) expect(obj).type.toBe<Record<string, unknown>>();
      if (isPathWithType(obj, 'e', 'undefined')) expect(obj).type.toBe<Record<string, unknown>>();
      if (isPathWithType(obj, 'f', 'array')) expect(obj).type.toBe<Record<string, unknown>>();
      if (isPathWithType(obj, 'g', 'object')) expect(obj).type.toBe<Record<string, unknown>>();
      if (isPathWithType(obj, 'h', 'function')) expect(obj).type.toBe<Record<string, unknown>>();
    });
  });
});

describe('isPathWithValue', () => {
  describe('positive cases', () => {
    it('should narrow unknown to object when value matches', () => {
      const obj: unknown = { foo: { bar: 'test' } };

      if (isPathWithValue(obj, 'foo.bar', 'test')) {
        expect(obj).type.toBe<Record<string, unknown>>();
      }
    });

    it('should preserve original type with generic overload', () => {
      type TestType = { foo: { bar: string } };
      const obj: TestType = { foo: { bar: 'test' } };

      if (isPathWithValue(obj, 'foo.bar', 'test')) {
        expect(obj).type.toBe<TestType & Record<string, unknown>>();
      }
    });

    it('should work with numeric value', () => {
      const obj: unknown = { foo: { bar: 123 } };

      if (isPathWithValue(obj, 'foo.bar', 123)) {
        expect(obj).type.toBe<Record<string, unknown>>();
      }
    });

    it('should work with array path', () => {
      const obj: unknown = { foo: { bar: true } };

      if (isPathWithValue(obj, ['foo', 'bar'] as const, true)) {
        expect(obj).type.toBe<Record<string, unknown>>();
      }
    });

    it('should preserve type with array path using generic overload', () => {
      type TestType = { foo: { bar: number } };
      const obj: TestType = { foo: { bar: 42 } };

      if (isPathWithValue(obj, ['foo', 'bar'] as const, 42)) {
        expect(obj).type.toBe<TestType & Record<string, unknown>>();
      }
    });

    it('should work with various value types', () => {
      const obj: unknown = { a: null, b: undefined, c: false, d: 0, e: '' }; // eslint-disable-line unicorn/no-null

      if (isPathWithValue(obj, 'a', null)) expect(obj).type.toBe<Record<string, unknown>>(); // eslint-disable-line unicorn/no-null
      // eslint-disable-next-line unicorn/no-useless-undefined
      if (isPathWithValue(obj, 'b', undefined)) expect(obj).type.toBe<Record<string, unknown>>();
      if (isPathWithValue(obj, 'c', false)) expect(obj).type.toBe<Record<string, unknown>>();
      if (isPathWithValue(obj, 'd', 0)) expect(obj).type.toBe<Record<string, unknown>>();
      if (isPathWithValue(obj, 'e', '')) expect(obj).type.toBe<Record<string, unknown>>();
    });
  });
});

describe('assertObjectWithPath', () => {
  describe('positive cases', () => {
    it('should narrow unknown to object', () => {
      const unknownValue: unknown = { foo: { bar: {} } };
      const path = 'foo.bar';

      assertObjectWithPath(unknownValue, path);
      expect(unknownValue).type.toBe<Record<string, unknown>>();
    });

    it('should preserve original type with generic overload', () => {
      type TestType = { foo: { bar: { baz: string } } };
      const obj: TestType = { foo: { bar: { baz: 'test' } } };

      assertObjectWithPath(obj, 'foo.bar');
      expect(obj).type.toBe<TestType & Record<string, unknown>>();
    });

    it('should work with array path', () => {
      const unknownValue: unknown = { foo: { bar: {} } };
      const path = ['foo', 'bar'] as const;

      assertObjectWithPath(unknownValue, path);
      expect(unknownValue).type.toBe<Record<string, unknown>>();
    });

    it('should preserve type with array path using generic overload', () => {
      type TestType = { foo: { bar: { baz: boolean } } };
      const obj: TestType = { foo: { bar: { baz: false } } };

      assertObjectWithPath(obj, ['foo', 'bar'] as const);
      expect(obj).type.toBe<TestType & Record<string, unknown>>();
    });

    it('should work with deeply nested paths', () => {
      type DeepType = { a: { b: { c: { d: string } } } };
      const obj: DeepType = { a: { b: { c: { d: 'deep' } } } };

      assertObjectWithPath(obj, 'a.b.c');
      expect(obj).type.toBe<DeepType & Record<string, unknown>>();
    });
  });
});

describe('assertPathWithType', () => {
  describe('positive cases', () => {
    it('should narrow unknown to object', () => {
      const unknownValue: unknown = { foo: { bar: 'test' } };
      const path = 'foo.bar';

      assertPathWithType(unknownValue, path, 'string');
      expect(unknownValue).type.toBe<Record<string, unknown>>();
    });

    it('should preserve original type with generic overload', () => {
      type TestType = { foo: { bar: string } };
      const obj: TestType = { foo: { bar: 'test' } };

      assertPathWithType(obj, 'foo.bar', 'string');
      expect(obj).type.toBe<TestType & Record<string, unknown>>();
    });

    it('should work with array path', () => {
      const unknownValue: unknown = { foo: { bar: 123 } };
      const path = ['foo', 'bar'] as const;

      assertPathWithType(unknownValue, path, 'number');
      expect(unknownValue).type.toBe<Record<string, unknown>>();
    });

    it('should preserve type with array path using generic overload', () => {
      type TestType = { foo: { bar: number } };
      const obj: TestType = { foo: { bar: 42 } };

      assertPathWithType(obj, ['foo', 'bar'] as const, 'number');
      expect(obj).type.toBe<TestType & Record<string, unknown>>();
    });

    it('should work with all literal types', () => {
      type AllTypes = { a: number; b: string; c: boolean; d: null; e: undefined; f: unknown[]; g: object; h: () => void };
      // eslint-disable-next-line unicorn/no-null
      const obj: AllTypes = { a: 1, b: '2', c: true, d: null, e: undefined, f: [], g: {}, h: () => {} };

      assertPathWithType(obj, 'a', 'number');
      assertPathWithType(obj, 'b', 'string');
      assertPathWithType(obj, 'c', 'boolean');
      assertPathWithType(obj, 'd', 'null');
      assertPathWithType(obj, 'e', 'undefined');
      assertPathWithType(obj, 'f', 'array');
      assertPathWithType(obj, 'g', 'object');
      assertPathWithType(obj, 'h', 'function');

      expect(obj).type.toBe<AllTypes & Record<string, unknown>>();
    });
  });
});

describe('assertPathWithValue', () => {
  describe('positive cases', () => {
    it('should narrow unknown to object', () => {
      const unknownValue: unknown = { foo: { bar: 'test' } };
      const path = 'foo.bar';

      assertPathWithValue(unknownValue, path, 'test');
      expect(unknownValue).type.toBe<Record<string, unknown>>();
    });

    it('should preserve original type with generic overload', () => {
      type TestType = { foo: { bar: string } };
      const obj: TestType = { foo: { bar: 'hello' } };

      assertPathWithValue(obj, 'foo.bar', 'hello');
      expect(obj).type.toBe<TestType & Record<string, unknown>>();
    });

    it('should work with array path', () => {
      const unknownValue: unknown = { foo: { bar: 123 } };
      const path = ['foo', 'bar'] as const;

      assertPathWithValue(unknownValue, path, 123);
      expect(unknownValue).type.toBe<Record<string, unknown>>();
    });

    it('should preserve type with array path using generic overload', () => {
      type TestType = { foo: { bar: boolean } };
      const obj: TestType = { foo: { bar: true } };

      assertPathWithValue(obj, ['foo', 'bar'] as const, true);
      expect(obj).type.toBe<TestType & Record<string, unknown>>();
    });

    it('should work with const values', () => {
      const EXPECTED_VALUE = 'constant' as const;
      type TestType = { config: string };
      const obj: TestType = { config: 'constant' };

      assertPathWithValue(obj, 'config', EXPECTED_VALUE);
      expect(obj).type.toBe<TestType & Record<string, unknown>>();
    });

    it('should work with literal value types', () => {
      type TestType = { num: 42; str: 'literal'; bool: false };
      const obj: TestType = { num: 42, str: 'literal', bool: false };

      assertPathWithValue(obj, 'num', 42);
      assertPathWithValue(obj, 'str', 'literal');
      assertPathWithValue(obj, 'bool', false);

      expect(obj).type.toBe<TestType & Record<string, unknown>>();
    });
  });
});
