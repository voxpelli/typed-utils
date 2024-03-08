import { expectType, expectNotType } from 'tsd';

import { isArrayOfType, isStringArray, isUnknownArray } from '../lib/array.js';

// isArrayOfType

const unknownNumberArray: unknown = [123];

expectNotType<number[]>(unknownNumberArray);

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

if (isArrayOfType(unknownNumberArray, isNumber)) {
  expectType<number[]>(unknownNumberArray);
}


// isUnknownArray
const unknownArray: unknown = [];

expectNotType<unknown[]>(unknownArray);

if (Array.isArray(unknownArray)) {
  expectType<any[]>(unknownArray);
  expectNotType<unknown[]>(unknownArray);
  if (isUnknownArray(unknownArray)) {
    expectType<unknown[]>(unknownArray);
  }
}

if (isUnknownArray(unknownArray)) {
  expectType<unknown[]>(unknownArray);
}

// isStringArray
const unknownStringArray: unknown = ['foo'];

expectNotType<string[]>(unknownStringArray);

if (isStringArray(unknownStringArray)) {
  expectType<string[]>(unknownStringArray);
}
