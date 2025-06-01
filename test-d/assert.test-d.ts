import { expectType, expectNever, expectNotType, expectError } from 'tsd';

import {
  assertObjectWithKey,
  assertKeyWithType,
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
  // @ts-expect-error Neede for tsd
  const value = knownValue[unknownKey];
  expectType<any>(value);

  assertObjectWithKey(knownValue, unknownKey);
  // @ts-expect-error Neede for tsd
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
  // @ts-expect-error Neede for tsd
  const value = knownValue[unknownKey];
  expectType<any>(value);

  assertKeyWithType(knownValue, unknownKey, 'string');
  expectType<string | undefined>(knownValue[unknownKey]);
} catch {}
