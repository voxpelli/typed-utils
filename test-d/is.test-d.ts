import { expectType, expectNever, expectNotType, expectError } from 'tsd';

import {
  isObjectWithKey,
  isKeyWithType,
  isType,
} from '../lib/is.js';

// isType - basic checks
const unknownValue: unknown = {};
expectNotType<object>(unknownValue);

if (isType(unknownValue, 'object')) {
  expectType<object>(unknownValue);

  if (isType(unknownValue, 'string')) {
    expectNever(unknownValue);
  }
}

// isType - ensure overlap with inferred typeof values
const unknownValue2: unknown = {};
const getTypeOf = (value: unknown) => typeof value;
if (isType(unknownValue2, getTypeOf(unknownValue2))) {
  expectType<string | number | bigint | boolean | symbol | object | (() => unknown) | undefined>(unknownValue2);
}

// isType - ensure overlap with specific inferred typeof value
const value: string = 'foo';

if (isType(value, typeof value)) {
  expectType<string>(value);

  if (isType(value, 'null')) {
    expectNever(value);
  }
}

// isObjectWithKey - with unknown object
const unknownValue3: unknown = {};
const key = 'foo';

expectError(unknownValue3[key]);

// Which will clear once its been checked
if (isObjectWithKey(unknownValue3, key)) {
  expectType<Record<'foo', unknown>>(unknownValue3);
  expectType<unknown>(unknownValue3[key]);
}

// isObjectWithKey - with unknown key, will still be unknown key
const knownValue = { foo: true };
const unknownKey: string = '';

expectType<Record<'foo', boolean>>(knownValue);
// @ts-expect-error Needed for tsd
const value2 = knownValue[unknownKey];
expectType<any>(value2);

if (isObjectWithKey(knownValue, unknownKey)) {
  // @ts-expect-error Needed for tsd
  const value3 = knownValue[unknownKey];
  expectType<any>(value3);
}

// isKeyWithType - with unknown object
const unknownValue4: unknown = {};
const key4 = 'foo';

expectError(unknownValue4[key4]);

if (isKeyWithType(unknownValue4, key4, 'string')) {
  expectType<Record<'foo', string>>(unknownValue4);
  expectType<string>(unknownValue4[key4]);
}

// isKeyWithType - with unknown key, will give known non-required type
const knownValue2 = { foo: true };
const unknownKey2: string = '';

expectType<Record<'foo', boolean>>(knownValue2);
// @ts-expect-error Needed for tsd
const value4 = knownValue2[unknownKey2];
expectType<any>(value4);

if (isKeyWithType(knownValue2, unknownKey2, 'string')) {
  expectType<string | undefined>(knownValue2[unknownKey2]);
}
