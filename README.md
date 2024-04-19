# @voxpelli/typed-utils

My personal (type-enabled) utils / helpers

[![npm version](https://img.shields.io/npm/v/@voxpelli/typed-utils.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/typed-utils)
[![npm downloads](https://img.shields.io/npm/dm/@voxpelli/typed-utils.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/typed-utils)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/voxpelli/eslint-config)
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

#### `getStringValueByPath(obj, path)`

#### `getValueByPath(obj, path)`

<!-- ## Used by

* [`example`](https://example.com/) – used by this one to do X and Y
 -->
## Similar modules

* [`type-helpers`](https://github.com/voxpelli/type-helpers) – my personal type helpers, contains no code, just types
<!--
## See also

* [Announcement blog post](#)
* [Announcement tweet](#) -->
