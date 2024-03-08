import { expectType, expectError } from 'tsd';

import { omit, pick } from '../lib/object.js';

const readonlyObject = { abc: 123, xyz: 789 } as const;
const readonlyKeys = ['abc'] as const;
const genericObject: Record<string, number> = { abc: 123, xyz: 789 };
const stringKeys = ['abc'];
const anyArray: any[] = ['abc']
const anyObject: Record<any, number> = { abc: 123, xyz: 789 };
const anyValue: any = ['abc']

// *** omit() ***

// Basic
expectType<{ abc: number }>(omit({ abc: 123, xyz: 789 }, ['xyz']));

// Basic, indirect
const omitResult = omit({ abc: 123, xyz: 789 }, ['xyz']);
expectType<{ abc: number }>(omitResult);

// With a read only object
expectType<{ readonly abc: 123 }>(omit(readonlyObject, ['xyz']));

// With read only keys
expectType<{ xyz: number }>(omit({ abc: 123, xyz: 789 }, readonlyKeys));

// With read only keys and read only object
expectType<{ readonly xyz: 789 }>(omit(readonlyObject, readonlyKeys));

// *** Generic values and keys ***

// Generic object type
expectType<Record<string, number>>(omit(genericObject, ['abc']));

// Generic key type + non-generic object
expectError(omit({ abc: 123, xyz: 789 }, stringKeys));

// Generic key type + generic object
expectType<{}>(omit(genericObject, stringKeys));

// Key type any array + generic object
expectType<{}>(omit(genericObject, anyArray));

// Key type any value + generic object
expectType<{}>(omit(genericObject, anyValue));

// *** Any values ***

// Key type any array + generic object
expectType<{}>(omit(genericObject, anyArray));

// Key type any value + generic object
expectType<{}>(omit(genericObject, anyValue));

// Key type any array + non-generic object
expectType<{}>(omit({ abc: 123, xyz: 789 }, anyArray));

// Key type any value + non-generic object
expectType<{}>(omit({ abc: 123, xyz: 789 }, anyValue));

// Any object type
expectType<Omit<any, 'abc'>>(omit(anyValue, ['abc']));

// Any object type
expectType<Omit<Record<any, number>, 'abc'>>(omit(anyObject, ['abc']));

// Key type any array + generic object
expectType<{}>(omit(anyValue, anyArray));

// Key type any value + generic object
expectType<{}>(omit(anyValue, anyValue));

// Key type any array + non-generic object
expectType<{}>(omit(anyObject, anyArray));

// Key type any value + non-generic object
expectType<{}>(omit(anyObject, anyValue));

// *** pick() ***

// Basic
expectType<{ abc: 123 }>(pick({ abc: 123, xyz: 789 }, ['abc']));

// Basic, indirect
const pickResult = pick({ abc: 123, xyz: 789 }, ['abc']);
expectType<{ abc: number }>(pickResult);

// With a read only object
expectType<{ readonly abc: 123 }>(pick(readonlyObject, ['abc']));

// With read only keys
expectType<{ abc: 123 }>(pick({ abc: 123, xyz: 789 }, readonlyKeys));

// With read only keys and read only object
expectType<{ readonly abc: 123 }>(pick(readonlyObject, readonlyKeys));

// *** Generic values and keys ***

// Generic object type
expectType<Record<string, number>>(pick(genericObject, ['abc']));

// Generic key type + non-generic object
expectError(pick({ abc: 123, xyz: 789 }, stringKeys));

// Generic key type + generic object
expectType<Record<string, number>>(pick(genericObject, stringKeys));

// *** Any values ***

// Key type any array + generic object
expectType<Record<string, number>>(pick(genericObject, anyArray));

// Key type any value + generic object
expectType<Record<string, number>>(pick(genericObject, anyValue));

// Key type any array + non-generic object
expectType<Pick<{ abc: 123; xyz: 789; }, any>>(pick({ abc: 123, xyz: 789 }, anyArray));

// Key type any value + non-generic object
expectType<{ abc: 123, xyz: 789 }>(pick({ abc: 123, xyz: 789 }, anyValue));

// Any object type
expectType<Pick<any, 'abc'>>(pick(anyValue, ['abc']));

// Any object type
expectType<Pick<Record<any, number>, 'abc'>>(pick(anyObject, ['abc']));

// Key type any array + generic object
expectType<Pick<any, any>>(pick(anyValue, anyArray));

// Key type any value + generic object
expectType<Pick<any, string>>(pick(anyValue, anyValue));

// Key type any array + non-generic object
expectType<Pick<Record<any, number>, any>>(pick(anyObject, anyArray));

// Key type any value + non-generic object
expectType<Pick<Record<any, number>, any>>(pick(anyObject, anyValue));
