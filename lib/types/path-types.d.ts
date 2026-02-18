/**
 * Utility types for path-based type inference and narrowing.
 *
 * These types enable compile-time path validation and type extraction
 * for nested object properties using either dot notation strings or
 * arrays of keys. Inspired by type-fest's Get type.
 *
 * @module path-types
 */

/**
 * Extract the type at a given path in an object using dot notation.
 *
 * Recursively traverses the object type `T` following the path segments
 * in `P`. Returns `unknown` if any segment is not found.
 *
 * @template T - The object type to traverse
 * @template P - The path as a string literal (e.g., 'foo.bar.baz')
 * @example Basic path extraction
 * ```typescript
 * type Config = { server: { port: number; host: string } };
 * type Port = PathValue<Config, 'server.port'>; // number
 * type Host = PathValue<Config, 'server.host'>; // string
 * ```
 * @example Deep nesting
 * ```typescript
 * type Deep = { a: { b: { c: { d: boolean } } } };
 * type Result = PathValue<Deep, 'a.b.c.d'>; // boolean
 * ```
 * @example Invalid paths return unknown
 * ```typescript
 * type Config = { server: { port: number } };
 * type Invalid = PathValue<Config, 'server.missing'>; // unknown
 * ```
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
 * Extract the type at a given path in an object using an array of keys.
 *
 * Similar to PathValue but accepts an array/tuple of keys instead of
 * a dot-separated string. Works with both mutable and readonly arrays.
 *
 * @template T - The object type to traverse
 * @template P - The path as a readonly array of string literals
 * @example Basic array path
 * ```typescript
 * type Config = { server: { port: number; host: string } };
 * type Port = PathArrayValue<Config, ['server', 'port']>; // number
 * ```
 * @example Works with const assertions (readonly tuples)
 * ```typescript
 * type Data = { user: { profile: { name: string } } };
 * type Name = PathArrayValue<Data, ['user', 'profile', 'name'] as const>; // string
 * ```
 * @example Mutable arrays also supported
 * ```typescript
 * type Settings = { theme: { colors: { primary: string } } };
 * const path = ['theme', 'colors', 'primary'];
 * type Color = PathArrayValue<Settings, typeof path>; // string
 * ```
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
 * Validates that an object has a path resolving to a specific type.
 *
 * This type helper is useful for building type guards that check both
 * the existence of a path and the type of value at that path.
 *
 * @template T - The object type to check
 * @template P - The path (string or readonly array)
 * @template V - The expected value type at the path
 * @example Type guard usage
 * ```typescript
 * type Config = { server?: { port?: number } };
 * type Valid = ObjectWithPathOfType<Config, 'server.port', number>; // Config
 * type Invalid = ObjectWithPathOfType<Config, 'server.port', string>; // never
 * ```
 * @example With array paths
 * ```typescript
 * type Data = { user: { settings: { theme: 'dark' | 'light' } } };
 * type HasDarkTheme = ObjectWithPathOfType<Data, ['user', 'settings', 'theme'], 'dark'>; // Data | never
 * ```
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
 * Helper type for narrowing objects with path-based type guards.
 *
 * Used internally by type guard functions to determine the narrowed type.
 * Leverages PathValue/PathArrayValue to infer the type at the specified path.
 *
 * @template T - The object type being checked
 * @template P - The path to validate (string or readonly array)
 * @example Internal usage in isObjectWithPath
 * ```typescript
 * function isObjectWithPath<T>(obj: T, path: string): obj is PathNarrowed<T, typeof path> {
 *   // ... implementation
 * }
 * ```
 * @internal
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
 * Simplified path narrowing type that preserves the original object type.
 *
 * Returns the intersection of T with Record<string, unknown>, ensuring
 * TypeScript knows the value is both the original type T and a valid object
 * with string keys. This is the return type for most path-based type guards.
 *
 * @template T - The object type to narrow
 * @example Type guard return type
 * ```typescript
 * type Config = { server: { port: number } };
 * type Narrowed = PathNarrowedSimple<Config>; // Config & Record<string, unknown>
 * ```
 * @example Usage in type guards
 * ```typescript
 * function isObjectWithPath<T>(obj: T, path: string): obj is PathNarrowedSimple<T> {
 *   return typeof getObjectValueByPath(obj, path) === 'object';
 * }
 * // After guard: obj is Config & Record<string, unknown>
 * ```
 */
export type PathNarrowedSimple<T> = T & Record<string, unknown>;

/**
 * Helper type for assertion-based narrowing using path validation.
 *
 * Similar to PathNarrowed but used specifically for assertion functions
 * (functions with `asserts` return types). Uses PathValue/PathArrayValue
 * to verify the type exists at the specified path.
 *
 * @template T - The object type being asserted
 * @template P - The path to validate (string or readonly array)
 * @example Internal usage in assertion
 * ```typescript
 * function assertObjectWithPath<T>(
 *   obj: T,
 *   path: string
 * ): asserts obj is PathAsserted<T, typeof path> {
 *   if (!getObjectValueByPath(obj, path)) {
 *     throw new Error('Path not found');
 *   }
 * }
 * ```
 * @internal
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
 * Simplified assertion type that preserves the original object type.
 *
 * Returns the intersection of T with Record<string, unknown>, ensuring
 * TypeScript knows the value is both the original type T and a valid object.
 * This is used as the asserted type for most path-based assertion functions.
 *
 * @template T - The object type to assert
 * @example Assertion return type
 * ```typescript
 * type Config = { server: { port: number } };
 * type Asserted = PathAssertedSimple<Config>; // Config & Record<string, unknown>
 * ```
 * @example Usage in assertions
 * ```typescript
 * function assertObjectWithPath<T>(
 *   obj: T,
 *   path: string
 * ): asserts obj is PathAssertedSimple<T> {
 *   if (!getObjectValueByPath(obj, path)) throw new Error();
 * }
 * // After assertion: obj is Config & Record<string, unknown>
 * ```
 */
export type PathAssertedSimple<T> = T & Record<string, unknown>;

/**
 * Helper type for asserting objects with a path of a specific type.
 *
 * Uses PathValue or PathArrayValue for precise type checking. Returns
 * the original type T intersected with Record when the path contains
 * a value of type V, otherwise returns never.
 *
 * @template T - The object type to validate
 * @template P - The path (string or readonly array)
 * @template V - The expected type at the path
 * @example String path validation
 * ```typescript
 * type Config = { server: { port: number } };
 * type Valid = AssertObjectWithPathOfType<Config, 'server.port', number>;
 * // Config & Record<string, unknown>
 * ```
 * @example Array path validation
 * ```typescript
 * type Settings = { theme: { mode: 'dark' | 'light' } };
 * type DarkMode = AssertObjectWithPathOfType<
 *   Settings,
 *   ['theme', 'mode'],
 *   'dark'
 * >; // Settings & Record<string, unknown> | never
 * ```
 * @example Type mismatch returns never
 * ```typescript
 * type Config = { port: number };
 * type Invalid = AssertObjectWithPathOfType<Config, 'port', string>; // never
 * ```
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
