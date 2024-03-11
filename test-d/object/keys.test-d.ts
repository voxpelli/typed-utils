import { expectType } from 'tsd';

import { typedObjectKeys, typedObjectKeysAll } from '../../lib/object.js';

const basicObject = { foo: 123, bar: 456 };
const unionObject = {} as ({ foo: 123, bar: 456 } | { bar: 789, xyz: 'abc' });
const genericObject = {} as Record<string, unknown>;

expectType<Array<'foo' | 'bar'>>(typedObjectKeys(basicObject))
expectType<Array<'bar'>>(typedObjectKeys(unionObject))
expectType<string[]>(typedObjectKeys(genericObject))

expectType<Array<'foo' | 'bar'>>(typedObjectKeys(basicObject))
expectType<Array<'foo' | 'bar' | 'xyz'>>(typedObjectKeysAll(unionObject))
expectType<string[]>(typedObjectKeysAll(genericObject))
