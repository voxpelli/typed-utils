/** @import { IsEmptyObject } from './types/misc-types.d.ts' */

/**
 * Noop function that validates at compile-time that Superset type is assignable to Base.
 *
 * Does nothing at runtime. Useful for type tests and ensuring type relationships hold.
 *
 * @template Base
 * @template {Base} Superset
 * @param {Base} _base - Base type to validate against
 * @param {Superset} _superset - Superset type that should be assignable to Base
 * @see {@link noopTypeIsEmptyObject} - Related type validation helper
 */
export function noopTypeIsAssignableToBase (_base, _superset) {}

/**
 * Noop function that validates at compile-time that Base type is an empty object.
 *
 * Does nothing at runtime. Useful for type tests.
 *
 * @template Base
 * @param {Base} _base - Base type to validate as empty
 * @param {IsEmptyObject<Base>} _shouldHaveKeys - Type-level check
 * @see {@link noopTypeIsAssignableToBase} - Related type validation helper
 */
export function noopTypeIsEmptyObject (_base, _shouldHaveKeys) {}

/**
 * Asserts that a value is of type `never`, used for exhaustive switch checks.
 *
 * This function ensures all cases in a discriminated union are handled at compile-time.
 * If called at runtime, it throws an error indicating an unhandled case was encountered.
 * TypeScript will produce a compile error if any cases are missing in the switch/conditional.
 *
 * @param {never} _value - The value that should be `never` (all cases handled)
 * @param {string} [message] - Error message if assertion fails (defaults to 'Expected value to not exist')
 * @throws {Error} Always throws, as this should never be reached at runtime
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking} - TypeScript exhaustiveness checking
 * @example
 * ```js
 * // Assuming "color" is of type: 'red' | 'green' | 'blue'
 * switch (color) {
 *   case 'red': return '#f00';
 *   case 'green': return '#0f0';
 *   case 'blue': return '#00f';
 *   default:
 *     // TypeScript error if a color case is missing
 *     assertTypeIsNever(color, `Unhandled color: ${color}`);
 * }
 * ```
 */
export function assertTypeIsNever (_value, message = 'Expected value to not exist') {
  throw new Error(message);
}
