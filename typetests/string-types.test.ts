import { describe, it, expect } from 'tstyche';

import type { NonGenericString } from '../lib/types/string-types.d.ts';

describe('NonGenericString', () => {
  // Core test: validates string literals pass through unchanged
  it('should accept and return specific string literal values', () => {
    expect<NonGenericString<'hello'>>().type.toBe<'hello'>();
    expect<NonGenericString<'world'>>().type.toBe<'world'>();
  });

  // Core test: validates generic string type is rejected
  it('should reject generic string type by returning never', () => {
    expect<NonGenericString<string>>().type.toBe<never>();
  });

  // Secondary test: validates custom error message is returned for rejected types
  it('should provide custom error message when generic string is detected', () => {
    expect<NonGenericString<string, 'Must be a string literal'>>().type.toBe<'Must be a string literal'>();
  });
});
