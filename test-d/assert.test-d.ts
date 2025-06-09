import { expectType, expectNever, expectNotType, expectError } from 'tsd';

import {
  assertKeyWithType,
  assertObjectWithKey,
  assertOptionalKeyWithType,
  assertType,
} from '../lib/assert.js';

// assertType - basic assertions
try {
  const unknownValue: unknown = {};
  expectNotType<object>(unknownValue);

  assertType(unknownValue, 'object');
  expectType<object>(unknownValue);

  assertType(unknownValue, 'string');
  expectNever(unknownValue);
} catch {}

// assertType - ensure overlap with inferred typeof values
try {
  const unknownValue2: unknown = {};
  const getTypeOf = (value: unknown) => typeof value;
  assertType(unknownValue2, getTypeOf(unknownValue2));
  expectType<string | number | bigint | boolean | symbol | object | (() => unknown) | undefined>(unknownValue2);
} catch {}

// assertType - ensure overlap with specific inferred typeof value
try {
  const value: string = 'foo';

  assertType(value, typeof value);
  expectType<string>(value);

  assertType(value, 'null');
  expectNever(value);
} catch {}

// assertObjectWithKey - with unknown object
try {
  const unknownValue: unknown = {};
  const key = 'foo';

  expectError(unknownValue[key]);

  // Which will clear once its been asserted
  assertObjectWithKey(unknownValue, key);
  expectType<Record<'foo', unknown>>(unknownValue);
  expectType<unknown>(unknownValue[key]);
} catch {}

// assertObjectWithKey - with unknown key, will still be unknown key
try {
  const knownValue = { foo: true };
  const unknownKey: string = '';

  expectType<Record<'foo', boolean>>(knownValue);
  // @ts-expect-error Needed for tsd
  const value = knownValue[unknownKey];
  expectType<any>(value);

  assertObjectWithKey(knownValue, unknownKey);
  // @ts-expect-error Needed for tsd
  const value2 = knownValue[unknownKey];
  expectType<any>(value2);
} catch {}

// assertKeyWithType - with unknown object
try {
  const unknownValue: unknown = {};
  const key = 'foo';

  expectError(unknownValue[key]);

  assertKeyWithType(unknownValue, key, 'string');
  expectType<Record<'foo', string>>(unknownValue);
  expectType<string>(unknownValue[key]);
} catch {}

// assertKeyWithType - with unknown key, will give known non-required type
try {
  const knownValue = { foo: true };
  const unknownKey: string = '';

  expectType<Record<'foo', boolean>>(knownValue);
  // @ts-expect-error Needed for tsd
  const value = knownValue[unknownKey];
  expectType<any>(value);

  assertKeyWithType(knownValue, unknownKey, 'string');
  expectType<string | undefined>(knownValue[unknownKey]);
} catch {}

// assertKeyWithType - key missing
try {
  const objWithoutKey1 = { bar: true };
  assertKeyWithType(objWithoutKey1, 'foo', 'string');
  expectType<{ bar: boolean } & Record<'foo', string>>(objWithoutKey1);
  expectType<string>(objWithoutKey1['foo']);
} catch {}

// assertKeyWithType - key present but undefined
try {
  const objWithUndefined1 = { bar: true, foo: undefined };
  assertKeyWithType(objWithUndefined1, 'foo', 'string');
  expectType<never>(objWithUndefined1);
} catch {}

// assertKeyWithType - key present but wrong type
try {
  const objWithWrongType1 = { bar: true, foo: true };
  assertKeyWithType(objWithWrongType1, 'foo', 'string');
  expectType<never>(objWithWrongType1);
} catch {}

// assertOptionalKeyWithType - with unknown object
try {
  const unknownValue5: unknown = {};
  const key5 = 'foo';

  expectError(unknownValue5[key5]);

  assertOptionalKeyWithType(unknownValue5, key5, 'string');
  expectType<Partial<Record<'foo', string>>>(unknownValue5);
  expectType<string | undefined>(unknownValue5[key5]);
} catch {}

// assertOptionalKeyWithType - with unknown key, will give known non-required type
try {
  const knownValue3 = { foo: true };
  const unknownKey3: string = '';

  expectType<Record<'foo', boolean>>(knownValue3);
  // @ts-expect-error Needed for tsd
  const value5 = knownValue3[unknownKey3];
  expectType<any>(value5);

  assertOptionalKeyWithType(knownValue3, unknownKey3, 'string');
  expectType<string | undefined>(knownValue3[unknownKey3]);
} catch {}

// assertOptionalKeyWithType - key missing
try {
  const objWithoutKey = { bar: true };
  assertOptionalKeyWithType(objWithoutKey, 'foo', 'string');
  expectType<{ bar: boolean } & Partial<Record<'foo', string>>>(objWithoutKey);
  expectType<string | undefined>(objWithoutKey['foo']);
} catch {}

// assertOptionalKeyWithType - key present but undefined
try {
  const objWithUndefined = { bar: true, foo: undefined };
  assertOptionalKeyWithType(objWithUndefined, 'foo', 'string');
  expectType<{ bar: boolean; foo: undefined; } & Partial<Record<'foo', string>>>(objWithUndefined);
  expectType<undefined>(objWithUndefined['foo']);
} catch {}

// assertOptionalKeyWithType - key present but wrong type
try {
  const objWithWrongType = { bar: true, foo: true };
  assertOptionalKeyWithType(objWithWrongType, 'foo', 'string');
  expectType<never>(objWithWrongType);
} catch {}
