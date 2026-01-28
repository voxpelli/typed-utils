import { describe, it, expect } from 'tstyche';

import { omit, pick } from '../lib/object.js';

describe('omit', () => {
  it('should omit keys from object', () => {
    const result = omit({ abc: 123, xyz: 789 }, ['xyz'] as const);
    expect(result).type.toBe<{ abc: number }>();
  });

  it('should preserve readonly objects', () => {
    const readonlyObject = { abc: 123, xyz: 789 } as const;
    const result = omit(readonlyObject, ['xyz'] as const);
    expect(result).type.toBe<{ readonly abc: 123 }>();
  });

  it('should handle generic object type', () => {
    const genericObject: Record<string, number> = { abc: 123, xyz: 789 };
    const result = omit(genericObject, ['abc'] as const);
    expect(result).type.toBe<Record<string, number>>();
  });

  it('should handle any object', () => {
    const anyValue: any = ['abc'];
    const result = omit(anyValue, ['abc'] as const);
    expect(result).type.toBeAssignableTo<Omit<any, 'abc'>>();
  });
});

describe('pick', () => {
  it('should pick keys from object', () => {
    const result = pick({ abc: 123, xyz: 789 }, ['abc'] as const);
    expect(result).type.toBe<{ abc: number }>();
  });

  it('should narrow to picked type for indirect result', () => {
    const result = pick({ abc: 123, xyz: 789 }, ['abc']);
    expect(result).type.toBe<{ abc: number }>();
  });

  it('should preserve readonly objects', () => {
    const readonlyObject = { abc: 123, xyz: 789 } as const;
    const result = pick(readonlyObject, ['abc'] as const);
    expect(result).type.toBe<{ readonly abc: 123 }>();
  });

  it('should handle generic object type', () => {
    const genericObject: Record<string, number> = { abc: 123, xyz: 789 };
    const result = pick(genericObject, ['abc'] as const);
    expect(result).type.toBe<Pick<Record<string, number>, 'abc'>>();
  });

  it('should handle any object', () => {
    const anyValue: any = ['abc'];
    const result = pick(anyValue, ['abc'] as const);
    expect(result).type.toBeAssignableTo<Pick<any, 'abc'>>();
  });
});
