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
