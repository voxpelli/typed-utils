# @voxpelli/typed-utils

My personal (type-enabled) utils / helpers

[![npm version](https://img.shields.io/npm/v/@voxpelli/typed-utils.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/typed-utils)
[![npm downloads](https://img.shields.io/npm/dm/@voxpelli/typed-utils.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/typed-utils)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/neostandard/neostandard)
[![Types in JS](https://img.shields.io/badge/types_in_js-yes-brightgreen)](https://github.com/voxpelli/types-in-js)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/voxpelli/typed-utils)
[![Follow @voxpelli@mastodon.social](https://img.shields.io/mastodon/follow/109247025527949675?domain=https%3A%2F%2Fmastodon.social&style=social)](https://mastodon.social/@voxpelli)

## Requirements

> [!NOTE]
> Check the `"engines"` field in [`package.json`](./package.json) for the definitive version requirements, as they may be updated independently of this README.

- **Node.js**: ^20.11.0 or >=22.0.0
- **TypeScript**: >=5.8

## Usage

### Simple

```javascript
import { filter } from '@voxpelli/typed-utils';

/** @type {string[]} */
const noUndefined = filter(['foo', undefined]);
```

## Helpers

### Array

#### `filter(inputArray, [valueToRemove]) => filteredArray`

Takes an array as `inputArray` and a `valueToRemove` that is a string literal, `false`, `null` or `undefined`, defaulting to `undefined` if left out.

Creates a new array with all values from `inputArray` except the one that matches `valueToRemove`, then returns that array with a type where the`valueToRemove` type has also been removed from the possible values.

Can be useful in combination with eg. a `.map()` where some items in the array has resulted in `undefined` / `null` / `false` values that one wants to have removed before processing the result further.

#### `filterWithCallback(value, callback)`

Similar to `Array.prototype.filter()` but expects the `callback` to be a function like `(value: unknown) => value is any` where the `is` is the magic sauce.

#### `isArrayOfType(value, callback)`

Similar to `Array.isArray()` but also checks that the array only contains values of type verified by the `callback` function and sets the type to be an array of that type rather than simply `any[]`. The `callback` should be a function like `(value: unknown) => value is any` and needs to have an `is` in the return type for the types to work.

#### `isStringArray(value)`

Similar to `Array.isArray()` but also checks that the array only contains values of type `string` and sets the type to `string[]` rather than `any[]`.

#### `typesafeIsArray(value)`

Alias: ~~`isUnknownArray(value)`~~ (deprecated)

Does the exact same thing as `Array.isArray()` but derives the type `unknown[]` rather than `any[]`, which improves strictness.

#### `typesafeIsReadonlyArray(value)`

Like `typesafeIsArray()` but also accepts readonly arrays in the type signature. Returns `true` if the value is an array (either mutable or readonly). Useful for functions that need to work with both regular arrays and readonly tuples from const assertions.

Example:
```js
const mutablePath = ['server', 'port'];
const readonlyPath = ['server', 'port'] as const;

if (typesafeIsReadonlyArray(mutablePath)) {
  // mutablePath is unknown[]
}

if (typesafeIsReadonlyArray(readonlyPath)) {
  // readonlyPath is readonly unknown[]
}

// Used internally by path helpers to accept both formats
function processPath(path) {
  const keys = typesafeIsReadonlyArray(path) 
    ? [...path] 
    : path.split('.');
  return keys;
}
```

#### `guardedArrayIncludes(collection, searchElement)`

Type-narrowing variant of `Array.prototype.includes` that works on arrays and sets. Returns `true` if `searchElement` is strictly equal to a member of `collection`. When `true`, narrows the type of `searchElement` to the element type of the iterable (`C extends Iterable<infer U> ? U : never`). Useful when you have an `unknown` (or union) value and want to both test membership and refine its type in one step.

Example:
```js
/** @type {readonly ("red"|"green"|"blue")[]} */
const COLORS = ["red", "green", "blue"];
let input /** @type {string | number} */ = Math.random() > 0.5 ? 'red' : 42;

if (guardedArrayIncludes(COLORS, input)) {
  // inside: input is now "red"|"green"|"blue"
}
```

#### `ensureArray(value)`

Converts a value to an array if it isn't already one. If `value` is already an array, returns it as-is. Otherwise, wraps `value` in a new single-element array. Useful for normalizing inputs that may be either a single item or an array of items.

Example:
```js
/** @type {string | string[]} */
const input = Math.random() > 0.5 ? 'single' : ['multiple', 'items'];

const normalized = ensureArray(input); // always string[]
```

### Assertions

#### `TypeHelpersAssertionError`

Custom error class thrown by all assertion helpers in this module. You can catch this error type to specifically handle assertion failures from these utilities.

#### `assert(condition, message)`

Throws a `TypeHelpersAssertionError` if `condition` is falsy. Used internally by other assertion helpers, but can also be used directly for custom runtime assertions.

#### `assertObjectWithKey(obj, key)`

Asserts that `obj` is an object and contains the property `key`. Throws an error if not.

#### `assertType(value, type, [message])`

Asserts that `value` is of the given `type` (string literal, eg. `'string'`, `'number'`, `'array'`, `'null'` – same as returned by [`explainVariable()`](#explainvariablevalue)). Throws an error if not. Optional custom error message.

#### `assertKeyWithType(obj, key, type)`

Asserts that `obj` is an object, contains the property `key`, and that `obj[key]` is of the given `type`.

#### `assertOptionalKeyWithType(obj, key, type)`

Asserts that `obj` is an object and either does not contain the property `key`, or if present, that `obj[key]` is `undefined` or of the given `type`.

#### `assertArrayOfLiteralType(value, type, [message])`

Asserts that `value` is an array where every element is of the given `type` (string literal, eg. `'string'`, `'number'`, `'array'`, `'null'`). Throws an error if any element fails the type check. Optional custom error message.

#### `assertObjectValueType(obj, type)`

Asserts that `obj` is an object where all values are of the given `type` and all keys are strings. This is useful for validating objects used as dictionaries/maps with homogeneous value types.

### `is`-calls / Type Checks

#### `isObjectWithKey(obj, key)`

Returns `true` if `obj` is an object and contains the property `key`.

#### `isType(value, type)`

Returns `true` if `value` is of the given `type` (string literal, eg. `'string'`, `'number'`, `'array'`, `'null'` – same as returned by [`explainVariable()`](#explainvariablevalue)).

#### `isKeyWithType(obj, key, type)`

Returns `true` if `obj` is an object, contains the property `key`, and `obj[key]` is of the given `type`.

#### `isOptionalKeyWithType(obj, key, type)`

Returns `true` if `obj` is an object and either does not contain the property `key`, or if present, `obj[key]` is of the given `type` or `undefined`.

#### `isPropertyKey(value)`

Runtime guard that returns `true` when `value` is a valid `PropertyKey` (`string | number | symbol`). Used internally by `hasOwn()` helpers; exported for external guard composition.

### Miscellaneous

#### `explainVariable(value)`

Returns a `typeof` style explanation of a variable, with added support for eg. `null` and `array`

#### `looksLikeAnErrnoException(err)`

Returns `true` if the `err` looks like being of the `NodeJS.ErrnoException` type

### Object

#### `omit(obj, keys)`

The TypeScript utility type [`Omit<obj, keys>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys) with code that does the actual omit.

#### `pick(obj, keys)`

The TypeScript utility type [`Pick<obj, keys>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys) with code that does the actual pick.

#### `typedObjectKeys(obj)`

Like [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) but typed with `Array<keyof obj>` rather than `string[]`. When `obj` is a union this means the type will resolve to only the keys _shared_ between all objects in the union.

#### `typedObjectKeysAll(obj)`

Like [`typedObjectKeys(obj)`](#typedobjectkeysobj) but when `obj` is a union this type will resolve to _all possible keys_ within that union, not just the shared ones.

#### `hasOwn(obj, key)`

Safe wrapper + type guard around `Object.hasOwn(obj, key)` that first ensures `key` is a `PropertyKey`. Narrows `key` to the intersection of keys when `obj` is a union type (same semantics as `typedObjectKeys`). Unlike the raw `in` operator, prototype chain properties are excluded.

Example:
```js
const shape = Math.random() > 0.5 ? { kind: 'a', value: 1 } : { kind: 'b', label: 'hi' };
let k /** @type {string | number | symbol} */ = 'kind';
if (hasOwn(shape, k)) {
  // k narrowed to 'kind'
  console.log(shape[k]); // 'a' | 'b' (further narrowed by shape.kind checks)
}
```

#### `hasOwnAll(obj, key)`

Variant of `hasOwn()` whose key type narrows to the full union of all possible keys across union object members (like `typedObjectKeysAll`). Runtime behavior is identical to `hasOwn()`; the difference is purely at the type level. Indexed access still requires a further presence guard because not every union member has every key.

Example union refinement:
```js
/** @type {{ foo: number; bar: string } | { foo: number; baz: boolean }} */
const maybe = Math.random() ? { foo: 1, bar: 'x' } : { foo: 2, baz: true };
/** @type {string} */
const key = Math.random() ? 'bar' : 'baz';
if (hasOwnAll(maybe, key)) {
  // key: 'foo' | 'bar' | 'baz'
  switch (key) {
    case 'baz':
      // Safe indexed access after runtime membership confirmation
      if (key in maybe) console.log(maybe[key]);
      break;
    // ... more checks
  }
}
```

### Object Path

Path-based helpers for safely navigating and validating nested object structures. All path functions support both dot-separated string paths (`'foo.bar.baz'`) and array paths (`['foo', 'bar', 'baz']`), including readonly arrays.

**When to Use Path-Based Functions:**

Use the path-based helpers (`isPathWithType`, `assertPathWithType`, etc.) when:
- ✅ Working with deeply nested object structures where manual navigation is cumbersome
- ✅ Validating configuration objects with dynamic or variable paths
- ✅ Parsing external data (JSON, APIs) where nested structure needs validation
- ✅ Need to check multiple levels of nesting with a single validation call
- ✅ Working with path strings from external sources (user input, config files)

Use the direct property helpers (`isType`, `assertType`, `isKeyWithType`, etc.) when:
- ✅ Accessing properties at the top level or shallow nesting (1-2 levels)
- ✅ You know the exact property structure at compile time
- ✅ Want more precise type narrowing for discriminated unions
- ✅ Need to validate individual values rather than nested paths
- ✅ Performance is critical (direct access is faster than path traversal)

**Examples:**

```javascript
// ❌ Don't use path-based for shallow access
if (isPathWithType(config, 'port', 'number')) { /* ... */ }

// ✅ Use direct helper instead
if (isType(config.port, 'number')) { /* ... */ }

// ❌ Don't use direct access for deep nesting
if (isType(config?.server?.database?.connection?.pool, 'object')) { /* ... */ }

// ✅ Use path-based helper instead
if (isObjectWithPath(config, 'server.database.connection.pool')) { /* ... */ }

// ✅ Path-based excels with dynamic paths
const pathToValidate = userInput; // e.g., "server.cache.redis"
if (isObjectWithPath(config, pathToValidate)) { /* ... */ }

// ✅ Direct helpers excel with known structure
if (isKeyWithType(config, 'server', 'object')) {
  // More precise narrowing for config.server
}
```

#### `getObjectValueByPath(obj, path, createIfMissing)`

Returns the object at the given path within `obj`, where `path` can be a string (dot-separated) or an array of strings. If `createIfMissing` is `true`, missing objects along the path are created. Returns `false` if a non-object is encountered, or `undefined` if the path does not exist.

**Example:**
```javascript
const config = { server: { settings: { port: 3000 } } };

const settings = getObjectValueByPath(config, 'server.settings');
// { port: 3000 }

const missing = getObjectValueByPath(config, 'server.database');
// undefined

const created = getObjectValueByPath(config, 'server.cache', true);
// {} (created if missing)
```

#### `getStringValueByPath(obj, path)`

Returns the string value at the given path within `obj`, or `false` if the value is not a string, or `undefined` if the path does not exist. The path can be a string (dot-separated) or an array of strings.

**Example:**
```javascript
const config = { server: { host: 'localhost', port: 3000 } };

const host = getStringValueByPath(config, 'server.host');
// 'localhost'

const notString = getStringValueByPath(config, 'server.port');
// false (port is a number, not a string)
```

#### `getValueByPath(obj, path)`

Returns an object `{ value }` where `value` is the value at the given path within `obj`, or `false` if a non-object is encountered, or `undefined` if the path does not exist. The path can be a string (dot-separated) or an array of strings.

**Example:**
```javascript
const data = { user: { profile: { age: 25 } } };

const result = getValueByPath(data, 'user.profile.age');
// { value: 25 }

const missing = getValueByPath(data, 'user.settings');
// undefined
```

#### `isObjectWithPath(obj, path)`

Type guard that returns `true` if the specified path exists in the object and resolves to an object value (not null, array, or primitive). Narrows the object type while preserving its structure.

**Example:**
```javascript
const config = { server: { port: 3000, settings: {} } };

if (isObjectWithPath(config, 'server')) {
  // config type is narrowed
  console.log(config.server.port);
}

if (isObjectWithPath(config, 'server.settings')) {
  // Nested path validation
  config.server.settings.timeout = 5000;
}

// Works with array paths
if (isObjectWithPath(config, ['server', 'settings'])) {
  // Type-safe access
}
```

#### `isPathWithType(obj, path, type)`

Type guard that returns `true` if the path exists and the value at that path matches the specified literal type (`'string'`, `'number'`, `'boolean'`, `'array'`, `'object'`, `'null'`, etc.).

**Example:**
```javascript
const config = { 
  server: { host: 'localhost', port: 3000 },
  features: ['auth', 'logging']
};

if (isPathWithType(config, 'server.host', 'string')) {
  // config.server.host is confirmed to be a string
  console.log(config.server.host.toUpperCase());
}

if (isPathWithType(config, 'server.port', 'number')) {
  // config.server.port is confirmed to be a number
  console.log(config.server.port * 2);
}

if (isPathWithType(config, 'features', 'array')) {
  // config.features is confirmed to be an array
  console.log(config.features.length);
}
```

#### `isPathWithValue(obj, path, expectedValue)`

Type guard that returns `true` if the path exists and the value at that path is strictly equal (`===`) to the expected value. Useful for checking configuration flags, environment modes, or specific states.

**Example:**
```javascript
const config = { 
  env: 'production',
  debug: false,
  server: { port: 8080 }
};

if (isPathWithValue(config, 'env', 'production')) {
  console.log('Running in production mode');
}

if (isPathWithValue(config, 'debug', false)) {
  console.log('Debug mode is disabled');
}

if (isPathWithValue(config, 'server.port', 8080)) {
  console.log('Using default port');
}
```

#### `assertObjectWithPath(obj, path)`

Asserts that the path exists and resolves to an object. Throws `TypeHelpersAssertionError` if the path doesn't exist or isn't an object. The object type is narrowed after the assertion.

**Example:**
```javascript
const config = { server: { settings: { timeout: 5000 } } };

assertObjectWithPath(config, 'server');
// Guaranteed to exist, can safely access properties
console.log(config.server.settings.timeout);

// Validate deeply nested structures
assertObjectWithPath(config, 'server.settings');

try {
  assertObjectWithPath(config, 'server.database');
} catch (err) {
  console.error('Missing database configuration');
  // TypeHelpersAssertionError: Expected path "server.database" to exist and be an object
}
```

#### `assertPathWithType(obj, path, type)`

Asserts that the path exists and the value matches the specified literal type. Throws `TypeHelpersAssertionError` if the path doesn't exist or the type doesn't match.

**Example:**
```javascript
const config = {
  server: { host: 'localhost', port: 3000 },
  features: ['auth', 'logging']
};

assertPathWithType(config, 'server.host', 'string');
// Guaranteed to be a string
const upperHost = config.server.host.toUpperCase();

assertPathWithType(config, 'server.port', 'number');
// Guaranteed to be a number
const timeout = config.server.port * 1000;

assertPathWithType(config, 'features', 'array');
// Guaranteed to be an array
console.log(config.features.length);

try {
  assertPathWithType(config, 'server.port', 'string');
} catch (err) {
  console.error('Invalid type:', err.message);
  // TypeHelpersAssertionError: Expected path "server.port" to have type "string", but got: number
}
```

#### `assertPathWithValue(obj, path, expectedValue)`

Asserts that the path exists and the value is strictly equal to the expected value. Throws `TypeHelpersAssertionError` if the path doesn't exist or the value doesn't match.

**Example:**
```javascript
const config = {
  env: 'production',
  debug: false,
  version: 2
};

assertPathWithValue(config, 'env', 'production');
// Guaranteed to be in production mode

assertPathWithValue(config, 'debug', false);
// Guaranteed debug is disabled

try {
  assertPathWithValue(config, 'version', 1);
} catch (err) {
  console.error('Version mismatch:', err.message);
  // TypeHelpersAssertionError: Expected path "version" to have value 1, but got: 2
}
```

**Path Format Examples:**
```javascript
// String paths (dot-separated)
isPathWithType(obj, 'server.database.connection.pool', 'object');

// Array paths (mutable)
const path = ['server', 'database', 'connection'];
isPathWithType(obj, path, 'object');

// Readonly array paths (with const assertion)
isPathWithType(obj, ['server', 'port'] as const, 'number');
```

**Prototype Pollution Protection:**

All path helpers include built-in protection against prototype pollution attacks by rejecting paths containing `__proto__`, `constructor`, or `prototype`:

```javascript
try {
  getObjectValueByPath(obj, '__proto__.polluted');
} catch (err) {
  // Error: Do not include "__proto__" in your path
}
```

### Type Utilities

#### Path Type Helpers

Advanced TypeScript utility types for path-based type inference and validation. These types enable compile-time path validation and type extraction for nested object properties. Available in `@voxpelli/typed-utils/path-types`.

##### `PathValue<T, P>`

Extracts the type at a given path in an object using dot notation string literals.

**Example:**
```typescript
import type { PathValue } from '@voxpelli/typed-utils/path-types';

type Config = {
  server: {
    database: {
      connection: {
        pool: { min: number; max: number }
      }
    }
  }
};

type PoolMax = PathValue<Config, 'server.database.connection.pool.max'>;
// number

type Pool = PathValue<Config, 'server.database.connection.pool'>;
// { min: number; max: number }

type Invalid = PathValue<Config, 'server.missing.path'>;
// unknown (invalid path)
```

##### `PathArrayValue<T, P>`

Extracts the type at a given path using an array/tuple of keys. Works with both mutable and readonly arrays.

**Example:**
```typescript
import type { PathArrayValue } from '@voxpelli/typed-utils/path-types';

type Data = {
  user: {
    profile: {
      settings: { theme: 'dark' | 'light' }
    }
  }
};

type Theme = PathArrayValue<Data, ['user', 'profile', 'settings', 'theme']>;
// 'dark' | 'light'

// Works with const assertions (readonly tuples)
type ThemeConst = PathArrayValue<Data, ['user', 'profile', 'settings', 'theme'] as const>;
// 'dark' | 'light'
```

##### `ObjectWithPathOfType<T, P, V>`

Validates that an object has a path resolving to a specific type. Returns the original type if valid, `never` if invalid.

**Example:**
```typescript
import type { ObjectWithPathOfType } from '@voxpelli/typed-utils/path-types';

type Config = {
  server?: {
    port?: number;
    host?: string;
  }
};

type ValidPort = ObjectWithPathOfType<Config, 'server.port', number>;
// Config (valid)

type InvalidPort = ObjectWithPathOfType<Config, 'server.port', string>;
// never (type mismatch)
```

##### `PathNarrowedSimple<T>` and `PathAssertedSimple<T>`

Simplified helper types used by path-based type guards and assertions. Return the intersection of `T` with `Record<string, unknown>`.

**Example:**
```typescript
import type { PathNarrowedSimple, PathAssertedSimple } from '@voxpelli/typed-utils/path-types';

type Config = { server: { port: number } };

type Narrowed = PathNarrowedSimple<Config>;
// Config & Record<string, unknown>

type Asserted = PathAssertedSimple<Config>;
// Config & Record<string, unknown>
```

**Practical Usage in Type Guards:**
```typescript
import { isPathWithType } from '@voxpelli/typed-utils';
import type { PathValue } from '@voxpelli/typed-utils/path-types';

type AppConfig = {
  database: {
    host: string;
    port: number;
  }
};

const config: unknown = loadConfig();

if (isPathWithType(config, 'database.port', 'number')) {
  // config is narrowed to AppConfig & Record<string, unknown>
  // You can now safely access config.database.port
  const port: number = config.database.port;
}

// Type-level validation
type DbPort = PathValue<AppConfig, 'database.port'>;
// number
```

#### `assertTypeIsNever(value, [message])`

Asserts that a value is of type `never`, used for exhaustive switch/conditional checks. This function ensures all cases in a discriminated union are handled. If called at runtime, it throws an error indicating an unhandled case was encountered.

Useful for compile-time exhaustiveness checking:
```js
/**
 * @param {'red' | 'green' | 'blue'} color
 */
function handleColor(color) {
  switch (color) {
    case 'red': return '#f00';
    case 'green': return '#0f0';
    case 'blue': return '#00f';
    default:
      // TypeScript error if a color case is missing
      assertTypeIsNever(color);
  }
}
```

#### `noopTypeIsAssignableToBase(base, superset)`

No-op function that validates at compile-time that `Superset` type is assignable to `Base` type. Does nothing at runtime. Useful for type tests and ensuring type relationships hold.

#### `noopTypeIsEmptyObject(base, shouldHaveKeys)`

No-op function that validates at compile-time that `Base` type is an empty object. Does nothing at runtime. Useful for type tests.

### Set

#### `FrozenSet`

An immutable variant of `Set`. All mutating methods (`add()`, `delete()`, `clear()`) throw a `TypeError`, making it safe to expose as a read-only collection without risking external mutation.

Useful when you want a `Set` API for membership tests (`has()`, iteration, `size`) but want to guarantee it cannot be modified after creation.

Example:

```js
import { FrozenSet } from '@voxpelli/typed-utils';

const COLORS = new FrozenSet(['red', 'green', 'blue']);

COLORS.has('red'); // true
COLORS.size;       // 3

COLORS.add('purple'); // throws TypeError: Cannot modify frozen set
```

To create one from an existing `Set`:

```js
const regular = new Set([1, 2, 3]);
const frozen = new FrozenSet(regular); // copies current contents; further changes to `regular` won't affect `frozen`
```

Notes:
* Still inherits all read-only / iteration behavior from `Set` (eg. `for...of`, spread, `keys()`, `values()`).
* Throws eagerly on mutation attempts—no silent failures.
* If you need deep immutability of nested values, freeze those separately; `FrozenSet` only prevents structural changes to the set itself.

<!-- ## Used by

* [`example`](https://example.com/) – used by this one to do X and Y
 -->
## Similar modules

* [`type-helpers`](https://github.com/voxpelli/type-helpers) – my personal type helpers, contains no code, just types
<!--
## See also

* [Announcement blog post](#)
* [Announcement tweet](#) -->
