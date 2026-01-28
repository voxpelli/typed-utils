import { describe, expect, test } from 'tstyche';
import {
  assertTypeIsNever,
  noopTypeIsAssignableToBase,
  noopTypeIsEmptyObject,
} from '../index.js';

describe('assertTypeIsNever', () => {
  test('should accept never type', () => {
    type Color = 'red' | 'green' | 'blue';

    function handleColor (color: Color): string {
      switch (color) {
      case 'red': return '#f00';
      case 'green': return '#0f0';
      case 'blue': return '#00f';
      default:
        // All cases handled, color is never
        assertTypeIsNever(color);
        return '';
      }
    }

    expect(handleColor).type.toBe<(color: Color) => string>();
  });

  test('should error on non-never types', () => {
    type Color = 'red' | 'green' | 'blue';

    function handleColorIncomplete (color: Color): string {
      switch (color) {
      case 'red': return '#f00';
      case 'green': return '#0f0';
      // Missing 'blue' case
      default:
        // @ts-expect-error: assignable to parameter of type 'never'
        assertTypeIsNever(color);
        return '';
      }
    }

    expect(handleColorIncomplete).type.toBe<(color: Color) => string>();
  });

  test('should work with discriminated unions', () => {
    type Shape =
      | { kind: 'circle'; radius: number }
      | { kind: 'square'; size: number }
      | { kind: 'rectangle'; width: number; height: number };

    function getArea (shape: Shape): number {
      switch (shape.kind) {
      case 'circle':
        return Math.PI * Math.pow(shape.radius, 2);
      case 'square':
        return Math.pow(shape.size, 2);
      case 'rectangle':
        return shape.width * shape.height;
      default:
        assertTypeIsNever(shape);
        return 0;
      }
    }

    expect(getArea).type.toBe<(shape: Shape) => number>();
  });
});

describe('noopTypeIsAssignableToBase', () => {
  test('should validate superset is assignable to base', () => {
    interface Base {
      a: string;
    }

    interface Superset extends Base {
      b?: number;
    }

    const base: Base = { a: 'test' };
    const superset: Superset = { a: 'test', b: 42 };

    // Should compile without error
    noopTypeIsAssignableToBase(base, superset);
  });

  test('should error when types are incompatible', () => {
    interface Base {
      a: string;
    }

    interface NotSuperset {
      b: number;
    }

    const base: Base = { a: 'test' };
    const notSuperset: NotSuperset = { b: 42 };

    // @ts-expect-error: not assignable to parameter of type 'Base'
    noopTypeIsAssignableToBase(base, notSuperset);
  });

  test('should validate literal types', () => {
    type Base = string;
    type Superset = 'hello' | 'world';

    const base: Base = 'test';
    const superset: Superset = 'hello';

    noopTypeIsAssignableToBase(base, superset);
  });
});

describe('noopTypeIsEmptyObject', () => {
  test('should validate empty object', () => {
    const empty = {};
    noopTypeIsEmptyObject(empty, true);
  });

  test('should reject non-empty object', () => {
    const notEmpty = { a: 1 };
    // @ts-expect-error: Argument of type 'true' is not assignable
    noopTypeIsEmptyObject(notEmpty, true);
  });

  test('should accept non-empty with false flag', () => {
    const notEmpty = { a: 1 };
    noopTypeIsEmptyObject(notEmpty, false);
  });

  test('should work with type aliases', () => {
    type Empty = Record<string, never>;
    type NotEmpty = { a: number };

    const empty: Empty = {};
    const notEmpty: NotEmpty = { a: 1 };

    noopTypeIsEmptyObject(empty, true);
    // @ts-expect-error: Argument of type 'true' is not assignable
    noopTypeIsEmptyObject(notEmpty, true);
  });
});
