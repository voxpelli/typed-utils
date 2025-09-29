import { expectType } from 'tsd';

import { hasOwn, hasOwnAll } from '../../lib/object.js';

function noop (_value: unknown) {}

const unionObj = {} as (
  { foo: 123, bar: 456 } |
  { foo: 789, abc: 'wow' } |
  { foo: 678, bar: 'foo', xyz: true }
);
const unknownA: PropertyKey = 'foo';

if ('xyz' in unionObj) {
  expectType<true>(unionObj['xyz']);
}

if (hasOwn(unionObj, unknownA)) {
  expectType<'foo'>(unknownA);
  expectType<123 | 789 | 678>(unionObj[unknownA]);

  switch (unknownA) {
    case 'foo':
      break;
    // @ts-expect-error Type narrowing has done to intersection of all union keys so this key is not available
    case 'bar':
      break;
    // @ts-expect-error Type narrowing has done to intersection of all union keys so this key is not available
    case 'abc':
      break;
    // @ts-expect-error Type narrowing has done to intersection of all union keys so this key is not available
    case 'xyz':
      break;
    default:
      // @ts-expect-error We have exhausted all the keys, causing a `never` type
      noop(unknownA.length);
  }
}

if (hasOwnAll(unionObj, unknownA)) {
  expectType<'foo' | 'bar' | 'abc' | 'xyz'>(unknownA);

  // @ts-expect-error Needs type narrowing to access
  noop(unionObj[unknownA]);

  switch (unknownA) {
    case 'foo':
      expectType<123 | 789 | 678>(unionObj[unknownA]);
      break;
    case 'bar':
      // @ts-expect-error Needs type narrowing to access
      noop(unionObj[unknownA]);

      if (unknownA in unionObj) {
        expectType<456 | 'foo'>(unionObj[unknownA]);
      }
      break;
    case 'abc':
      // @ts-expect-error Needs type narrowing to access
      noop(unionObj[unknownA]);

      if (unknownA in unionObj) {
        expectType<'wow'>(unionObj[unknownA]);
      }
      break;
    case 'xyz':
      // @ts-expect-error Needs type narrowing to access
      noop(unionObj[unknownA]);

      if (unknownA in unionObj) {
        expectType<true>(unionObj[unknownA]);
      }
      break;
    default:
      // @ts-expect-error We have exhausted all the keys, causing a `never` type
      noop(unknownA.length);
  }
}
