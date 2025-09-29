import { expectType } from 'tsd';

import { typedObjectKeys, typedObjectKeysAll } from '../../lib/object.js';

const basicObject = { foo: 123, bar: 456 };
const unionObject = {} as ({ foo: 123, bar: 456 } | { bar: 789, xyz: 'abc' });
const genericObject = {} as Record<string, unknown>;

expectType<Array<'foo' | 'bar'>>(typedObjectKeys(basicObject));
expectType<Array<'bar'>>(typedObjectKeys(unionObject));
expectType<string[]>(typedObjectKeys(genericObject));

expectType<Array<'foo' | 'bar'>>(typedObjectKeys(basicObject));
expectType<Array<'foo' | 'bar' | 'xyz'>>(typedObjectKeysAll(unionObject));
expectType<string[]>(typedObjectKeysAll(genericObject));

// Readonly (const) object
const readonlyConst = { alpha: 1, beta: 2 } as const;
expectType<Array<'alpha' | 'beta'>>(typedObjectKeys(readonlyConst));
expectType<Array<'alpha' | 'beta'>>(typedObjectKeysAll(readonlyConst));

// Object with optional property
const optionalObject = {} as { foo: number; bar?: string };
expectType<Array<'foo' | 'bar'>>(typedObjectKeys(optionalObject));
expectType<Array<'foo' | 'bar'>>(typedObjectKeysAll(optionalObject));

// Union involving optional property (tests intersection vs union of all keys)
const optionalUnion = {} as ({ foo?: 1; bar: 2 } | { bar: 2; baz: 3 });
expectType<Array<'bar'>>(typedObjectKeys(optionalUnion));
expectType<Array<'foo' | 'bar' | 'baz'>>(typedObjectKeysAll(optionalUnion));

// Union with generic-like record
const genericUnion = {} as ({ a: number; b: number } | Record<string, number>);
expectType<Array<'a' | 'b'>>(typedObjectKeys(genericUnion));
expectType<string[]>(typedObjectKeysAll(genericUnion));

// Any object
const anyObj: any = { x: 1 };
expectType<Array<string | number | symbol>>(typedObjectKeys(anyObj));
expectType<Array<string | number | symbol>>(typedObjectKeysAll(anyObj));
