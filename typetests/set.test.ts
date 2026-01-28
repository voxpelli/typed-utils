import { describe, it, expect } from 'tstyche';

import { FrozenSet } from '../lib/set.js';

describe('FrozenSet', () => {
  it('should construct FrozenSet from array', () => {
    const value = [123, 456] as const;
    const foo = new FrozenSet(value);

    expect(foo).type.toBe<FrozenSet<123 | 456>>();
  });

  it('should be convertible to Set', () => {
    const value = [123, 456] as const;
    const foo = new FrozenSet(value);
    const bar = new Set(foo);

    expect(bar).type.toBe<Set<123 | 456>>();
  });

  it('should be spreadable to array', () => {
    const value = [123, 456] as const;
    const foo = new FrozenSet(value);
    const abc = [...foo];

    expect(abc).type.toBe<Array<123 | 456>>();
  });
});
