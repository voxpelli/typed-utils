import { isKeyWithType } from './is.js';

/** @import { LiteralTypes } from './types/literal-types.d.ts' */

/**
 * @template {unknown} O
 * @template {string} K
 * @template {keyof LiteralTypes} T
 * @param {O} obj
 * @param {K} key
 * @param {T | T[]} type
 * @returns {(O & Record<K, LiteralTypes[T]>)[K] | undefined}
 */
export function getValueOfKeyWithType (obj, key, type) {
  if (!isKeyWithType(obj, key, type)) return;
  return obj[key];
}
