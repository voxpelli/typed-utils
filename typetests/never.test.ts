import { describe, expect, test } from 'tstyche';
import {
  assertTypeIsNever,
  isType,
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

  // ===========================================================================
  // Terminal statement tests (issue #82)
  //
  // CONTEXT: assertTypeIsNever previously returned `void`. TypeScript did not
  // know the function always throws, so code after it was considered reachable.
  // This meant TypeScript would still require a return statement after
  // assertTypeIsNever — defeating its purpose as an exhaustiveness guard.
  //
  // THE FIX: Adding `@returns {never}` tells TypeScript that assertTypeIsNever
  // never returns — it always throws. This makes all code after it unreachable.
  //
  // WHY `never` return type and not `asserts _value is never`?
  // - `asserts x is T` tells TypeScript "if this function returns normally, x is T"
  //   but it does NOT tell TypeScript "this function never returns". TypeScript
  //   still considers the function as potentially returning, meaning code after
  //   it is still considered reachable — which defeats the purpose.
  // - `never` return type directly communicates "this function never returns",
  //   making all subsequent code unreachable — the desired terminal behavior.
  // ===========================================================================
  test('should be terminal — no return statement needed after it in switch', () => {
    // With the old `void` return type, TypeScript would error here with:
    //   "Function lacks ending return statement and return type does not
    //    include 'undefined'"
    // because it thought the default branch could fall through.
    type Fruit = 'apple' | 'banana' | 'cherry';

    function fruitEmoji (fruit: Fruit): string {
      switch (fruit) {
      case 'apple': return '🍎';
      case 'banana': return '🍌';
      case 'cherry': return '🍒';
      default:
        // No return needed after this — assertTypeIsNever is terminal.
        assertTypeIsNever(fruit);
      }
    }

    expect(fruitEmoji).type.toBe<(fruit: Fruit) => string>();
  });

  test('should be terminal — no return needed after it in if-else chains', () => {
    // Terminal behavior should work in any control flow context, not just
    // switch statements. If-else chains are equally common for exhaustiveness.
    type Priority = 'low' | 'medium' | 'high';

    function priorityToNumber (priority: Priority): number {
      if (priority === 'low') return 1;
      if (priority === 'medium') return 2;
      if (priority === 'high') return 3;
      // No return needed — assertTypeIsNever is terminal.
      assertTypeIsNever(priority);
    }

    expect(priorityToNumber).type.toBe<(priority: Priority) => number>();
  });

  // ===========================================================================
  // Combined test: isType exhaustiveness + assertTypeIsNever terminal (issues #81 + #82)
  //
  // This test combines both fixes:
  // - Issue #81: LiteralTypes['object'] = object (enables false-branch narrowing)
  // - Issue #82: assertTypeIsNever returns never (enables terminal behavior)
  //
  // Together, these allow the full pattern:
  //   if (isType(x, 'string')) return ...;
  //   if (isType(x, 'object')) return ...;
  //   assertTypeIsNever(x); // no return needed, x is never
  // ===========================================================================
  test('should work end-to-end: isType exhaustiveness + terminal assertTypeIsNever', () => {
    // This is the "golden path" test. Without BOTH fixes, this pattern fails:
    // - Without #81 fix: isType(x, 'object') doesn't eliminate object types
    //   from the false branch, so `x` is not `never` at the assertTypeIsNever call.
    // - Without #82 fix: even if `x` is `never`, TypeScript thinks the function
    //   needs a return statement after assertTypeIsNever.
    interface Config { port: number; host: string }
    type Input = string | number | Config;

    function processInput (input: Input): string {
      if (isType(input, 'string')) return input;
      if (isType(input, 'number')) return String(input);
      if (isType(input, 'object')) return `${input.host}:${input.port}`;
      assertTypeIsNever(input);
    }

    expect(processInput).type.toBe<(input: Input) => string>();
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
