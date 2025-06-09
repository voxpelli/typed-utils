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

### Assertions

#### `assertObjectWithKey(obj, key)`

Asserts that `obj` is an object and contains the property `key`. Throws an error if not.

#### `assertType(value, type, [message])`

Asserts that `value` is of the given `type` (string literal, eg. `'string'`, `'number'`, `'array'`, `'null'` – same as returned by [`explainVariable()`](#explainvariablevalue)). Throws an error if not. Optional custom error message.

#### `assertKeyWithType(obj, key, type)`

Asserts that `obj` is an object, contains the property `key`, and that `obj[key]` is of the given `type`.

#### `assertOptionalKeyWithType(obj, key, type)`

Asserts that `obj` is an object and either does not contain the property `key`, or if present, that `obj[key]` is `undefined` or of the given `type`.

### `is`-calls / Type Checks

#### `isObjectWithKey(obj, key)`

Returns `true` if `obj` is an object and contains the property `key`.

#### `isType(value, type)`

Returns `true` if `value` is of the given `type` (string literal, eg. `'string'`, `'number'`, `'array'`, `'null'` – same as returned by [`explainVariable()`](#explainvariablevalue)).

#### `isKeyWithType(obj, key, type)`

Returns `true` if `obj` is an object, contains the property `key`, and `obj[key]` is of the given `type`.

#### `isOptionalKeyWithType(obj, key, type)`

Returns `true` if `obj` is an object and either does not contain the property `key`, or if present, `obj[key]` is of the given `type` or `undefined`.

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

### Object Path

#### `getObjectValueByPath(obj, path, createIfMissing)`

Returns the object at the given path within `obj`, where `path` can be a string (dot-separated) or an array of strings. If `createIfMissing` is `true`, missing objects along the path are created. Returns `false` if a non-object is encountered, or `undefined` if the path does not exist.

#### `getStringValueByPath(obj, path)`

Returns the string value at the given path within `obj`, or `false` if the value is not a string, or `undefined` if the path does not exist. The path can be a string (dot-separated) or an array of strings.

#### `getValueByPath(obj, path)`

Returns an object `{ value }` where `value` is the value at the given path within `obj`, or `false` if a non-object is encountered, or `undefined` if the path does not exist. The path can be a string (dot-separated) or an array of strings.

<!-- ## Used by

* [`example`](https://example.com/) – used by this one to do X and Y
 -->
## Similar modules

* [`type-helpers`](https://github.com/voxpelli/type-helpers) – my personal type helpers, contains no code, just types
<!--
## See also

* [Announcement blog post](#)
* [Announcement tweet](#) -->
