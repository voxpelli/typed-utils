import { expectType, expectNotType } from 'tsd';

import { guardedArrayIncludes } from '../lib/array.js';

// Array narrowing
const values: (string | number)[] = ['a', 1, 'b'];
const searchValues: unknown = 'a';
if (guardedArrayIncludes(values, searchValues)) {
  expectType<string | number>(searchValues);
  // Inside branch we only know that 'a' is an element; param doesn't narrow array itself
  expectType<(string | number)[]>(values);
} else {
  expectNotType<(string | number)[]>(searchValues);
  expectType<unknown>(searchValues);
}

// Set narrowing
const set: Set<string | number> = new Set(['x', 2]);
const searchSet: unknown = 'x';
if (guardedArrayIncludes(set, searchSet)) {
  expectType<string | number>(searchSet);
  expectType<Set<string | number>>(set);
}

// Union of Set and Array still usable
const union = Math.random() > 0.5 ? [5] : new Set(['z']);
const searchUnion: unknown = 'z';
if (guardedArrayIncludes(union, searchUnion)) {
  expectType<string | number>(searchUnion);
  expectType<number[] | Set<string>>(union);
}

// Narrowing of searched value against number[]
const onlyNumbers: number[] = [1, 2, 3];
const unknownSearch: unknown = 2;
if (guardedArrayIncludes(onlyNumbers, unknownSearch)) {
  expectType<number>(unknownSearch);
}

// Works with readonly array
const readonlyArray: readonly ['foo', 'bar'] = ['foo', 'bar'];
const searchReadonly: unknown = 'foo';
if (guardedArrayIncludes(readonlyArray, searchReadonly)) {
  expectType<'foo' | 'bar'>(searchReadonly);
  expectType<readonly ['foo', 'bar']>(readonlyArray);
}
