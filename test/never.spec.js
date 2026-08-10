import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  assertTypeIsNever,
  noopTypeIsAssignableToBase,
  noopTypeIsEmptyObject,
} from '../index.js';

/**
 * @param {'red' | 'green' | 'blue'} color
 * @returns {string}
 */
function handleColor (color) {
  switch (color) {
  case 'red': return '#f00';
  case 'green': return '#0f0';
  case 'blue': return '#00f';
  default:
    // This ensures all cases are handled
    assertTypeIsNever(color);
    return '';
  }
}

describe('never', () => {
  describe('assertTypeIsNever', () => {
    it('should throw with default message', () => {
      assert.throws(() => {
        // @ts-expect-error -- testing runtime behavior
        assertTypeIsNever('not never');
      }, /Expected value to not exist/);
    });

    it('should throw with custom message', () => {
      assert.throws(() => {
        // @ts-expect-error -- testing runtime behavior
        assertTypeIsNever('not never', 'Custom error message');
      }, /Custom error message/);
    });

    it('should be useful in exhaustive switch checks', () => {
      assert.strictEqual(handleColor('red'), '#f00');
      assert.strictEqual(handleColor('green'), '#0f0');
      assert.strictEqual(handleColor('blue'), '#00f');
    });
  });

  describe('noopTypeIsAssignableToBase', () => {
    it('should do nothing at runtime', () => {
      assert.doesNotThrow(() => {
        noopTypeIsAssignableToBase({}, {});
        noopTypeIsAssignableToBase({ a: 1 }, { a: 1, b: 2 });
      });
    });
  });

  describe('noopTypeIsEmptyObject', () => {
    it('should do nothing at runtime', () => {
      assert.doesNotThrow(() => {
        noopTypeIsEmptyObject({}, true);
        noopTypeIsEmptyObject({ a: 1 }, false);
      });
    });
  });
});
