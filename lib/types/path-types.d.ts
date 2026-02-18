/**
 * Utility types for path-based type inference
 * Inspired by type-fest's Get type
 */

/**
 * Extract the type at a given path in an object using dot notation
 *
 * @template T - The object type to traverse
 * @template P - The path as a string literal (e.g., 'foo.bar.baz')
 * @example
 * type Example = { foo: { bar: { baz: string } } };
 * type Result = PathValue<Example, 'foo.bar.baz'>; // string
 */
export type PathValue<T, P extends string> =
  P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? PathValue<T[Key], Rest>
      : unknown
    : P extends keyof T
      ? T[P]
      : unknown;

/**
 * Extract the type at a given path in an object using an array of keys
 *
 * @template T - The object type to traverse
 * @template P - The path as a readonly array of string literals
 * @example
 * type Example = { foo: { bar: { baz: string } } };
 * type Result = PathArrayValue<Example, ['foo', 'bar', 'baz']>; // string
 */
export type PathArrayValue<T, P extends readonly string[]> =
  P extends readonly [infer First extends string, ...infer Rest extends readonly string[]]
    ? First extends keyof T
      ? Rest['length'] extends 0
        ? T[First]
        : PathArrayValue<T[First], Rest>
      : unknown
    : T;

/**
 * Type guard narrowing for objects with a specific path containing a specific type
 *
 * @template T - The object type
 * @template P - The path (string or array)
 * @template V - The expected value type
 */
export type ObjectWithPathOfType<T, P extends string | readonly string[], V> =
  T extends Record<string, unknown>
    ? P extends string
      ? PathValue<T, P> extends V ? T : never
      : P extends readonly string[]
        ? PathArrayValue<T, P> extends V ? T : never
        : never
    : never;

/**
 * Helper type for narrowing objects with path-based type guards
 * Uses PathValue/PathArrayValue to infer the type at the path
 */
export type PathNarrowed<T, P extends string | readonly string[]> =
  T extends Record<string, unknown>
    ? P extends string
      ? PathValue<T, P> extends infer V
        ? V extends Record<string, unknown>
          ? T & Record<string, unknown>
          : Record<string, unknown>
        : Record<string, unknown>
      : P extends readonly string[]
        ? PathArrayValue<T, P> extends infer V
          ? V extends Record<string, unknown>
            ? T & Record<string, unknown>
            : Record<string, unknown>
          : Record<string, unknown>
        : Record<string, unknown>
    : Record<string, unknown>;

/**
 * Simplified version that preserves T when it's already a record
 * Used by type guards like isObjectWithPath
 */
export type PathNarrowedSimple<T> = T & Record<string, unknown>;

/**
 * Helper type for assertion-based narrowing
 * Uses PathValue/PathArrayValue to verify the type at the path
 */
export type PathAsserted<T, P extends string | readonly string[]> =
  T extends Record<string, unknown>
    ? P extends string
      ? PathValue<T, P> extends infer V
        ? V extends Record<string, unknown>
          ? T & Record<string, unknown>
          : Record<string, unknown>
        : Record<string, unknown>
      : P extends readonly string[]
        ? PathArrayValue<T, P> extends infer V
          ? V extends Record<string, unknown>
            ? T & Record<string, unknown>
            : Record<string, unknown>
          : Record<string, unknown>
        : Record<string, unknown>
    : Record<string, unknown>;

/**
 * Simplified version that preserves T when it's already a record
 * Used by assertions like assertObjectWithPath
 */
export type PathAssertedSimple<T> = T & Record<string, unknown>;

/**
 * Helper type for asserting objects with a path of a specific type
 * Uses PathValue or PathArrayValue for precise type checking
 */
export type AssertObjectWithPathOfType<
  T,
  P extends string | readonly string[],
  V
> = T extends Record<string, unknown>
  ? P extends string
    ? PathValue<T, P> extends V ? T & Record<string, unknown> : never
    : P extends readonly string[]
      ? PathArrayValue<T, P> extends V ? T & Record<string, unknown> : never
      : never
  : never;
