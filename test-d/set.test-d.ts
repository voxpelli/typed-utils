import { expectType } from 'tsd';

import { FrozenSet } from '../lib/set.js';

const value = [123, 456] as const;
const foo = new FrozenSet(value);
const bar = new Set(foo);
const abc = [...foo];

expectType<FrozenSet<123 | 456>>(foo);
expectType<Set<123 | 456>>(bar);
expectType<Array<123 | 456>>(abc);
