# @voxpelli/typed-utils

My personal (type-enabled) utils / helpers

[![npm version](https://img.shields.io/npm/v/@voxpelli/typed-utils.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/typed-utils)
[![npm downloads](https://img.shields.io/npm/dm/@voxpelli/typed-utils.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/typed-utils)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/neostandard/neostandard)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://github.com/voxpelli/badges-cjs-esm)
[![Types in JS](https://img.shields.io/badge/types_in_js-yes-brightgreen)](https://github.com/voxpelli/types-in-js)
[![Follow @voxpelli@mastodon.social](https://img.shields.io/mastodon/follow/109247025527949675?domain=https%3A%2F%2Fmastodon.social&style=social)](https://mastodon.social/@voxpelli)

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

#### `assertStringKeyedObject(obj)`

Asserts that `obj` is an object with only string keys. Throws an error if `obj` is not an object or if any of its keys are not strings. Useful for validating that an object can be used as a string-keyed dictionary.

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

#### `getObjectValueByPath(obj, path, createIfMissing)`

Returns the object at the given path within `obj`, where `path` can be a string (dot-separated) or an array of strings. If `createIfMissing` is `true`, missing objects along the path are created. Returns `false` if a non-object is encountered, or `undefined` if the path does not exist.

#### `getStringValueByPath(obj, path)`

Returns the string value at the given path within `obj`, or `false` if the value is not a string, or `undefined` if the path does not exist. The path can be a string (dot-separated) or an array of strings.

#### `getValueByPath(obj, path)`

Returns an object `{ value }` where `value` is the value at the given path within `obj`, or `false` if a non-object is encountered, or `undefined` if the path does not exist. The path can be a string (dot-separated) or an array of strings.

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
