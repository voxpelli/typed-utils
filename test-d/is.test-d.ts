import { expectType, expectNever, expectNotType, expectError } from 'tsd';

import {
  isObjectWithKey,
  isKeyWithType,
  isOptionalKeyWithType,
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

// isKeyWithType - key missing
const objWithoutKey1 = { bar: true };
if (isKeyWithType(objWithoutKey1, 'foo', 'string')) {
  expectType<{ bar: boolean } & Record<'foo', string>>(objWithoutKey1);
  expectType<string>(objWithoutKey1['foo']);
}

// isKeyWithType - key present but undefined
const objWithUndefined1 = { bar: true, foo: undefined };
if (isKeyWithType(objWithUndefined1, 'foo', 'string')) {
  expectType<never>(objWithUndefined1);
}

// isKeyWithType - key present but wrong type
const objWithWrongType1 = { bar: true, foo: true };
if (isKeyWithType(objWithWrongType1, 'foo', 'string')) {
  expectType<never>(objWithWrongType1);
}

// isOptionalKeyWithType - with unknown object
const unknownValue5: unknown = {};
const key5 = 'foo';

expectError(unknownValue5[key5]);

if (isOptionalKeyWithType(unknownValue5, key5, 'string')) {
  expectType<Partial<Record<'foo', string>>>(unknownValue5);
  expectType<string | undefined>(unknownValue5[key5]);
}

// isOptionalKeyWithType - with unknown key, will give known non-required type
const knownValue3 = { foo: true };
const unknownKey3: string = '';

expectType<Record<'foo', boolean>>(knownValue3);
// @ts-expect-error Needed for tsd
const value5 = knownValue3[unknownKey3];
expectType<any>(value5);

if (isOptionalKeyWithType(knownValue3, unknownKey3, 'string')) {
  expectType<string | undefined>(knownValue3[unknownKey3]);
}

// isOptionalKeyWithType - key missing
const objWithoutKey = { bar: true };
if (isOptionalKeyWithType(objWithoutKey, 'foo', 'string')) {
  expectType<{ bar: boolean } & Partial<Record<'foo', string>>>(objWithoutKey);
  expectType<string | undefined>(objWithoutKey['foo']);
}

// isOptionalKeyWithType - key present but undefined
const objWithUndefined = { bar: true, foo: undefined };
if (isOptionalKeyWithType(objWithUndefined, 'foo', 'string')) {
  expectType<{ bar: boolean; foo: undefined; } & Partial<Record<'foo', string>>>(objWithUndefined);
  expectType<undefined>(objWithUndefined['foo']);
}

// isKeyWithType - key present but wrong type
const objWithWrongType = { bar: true, foo: true };
if (isOptionalKeyWithType(objWithWrongType, 'foo', 'string')) {
  expectType<never>(objWithWrongType);
}
