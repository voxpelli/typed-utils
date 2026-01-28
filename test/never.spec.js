import chai from 'chai';

import {
  assertTypeIsNever,
  noopTypeIsAssignableToBase,
  noopTypeIsEmptyObject,
} from '../index.js';

chai.should();

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
      (() => {
        // @ts-expect-error -- testing runtime behavior
        assertTypeIsNever('not never');
      }).should.throw('Expected value to not exist');
    });

    it('should throw with custom message', () => {
      (() => {
        // @ts-expect-error -- testing runtime behavior
        assertTypeIsNever('not never', 'Custom error message');
      }).should.throw('Custom error message');
    });

    it('should be useful in exhaustive switch checks', () => {
      handleColor('red').should.equal('#f00');
      handleColor('green').should.equal('#0f0');
      handleColor('blue').should.equal('#00f');
    });
  });

  describe('noopTypeIsAssignableToBase', () => {
    it('should do nothing at runtime', () => {
      (() => {
        noopTypeIsAssignableToBase({}, {});
        noopTypeIsAssignableToBase({ a: 1 }, { a: 1, b: 2 });
      }).should.not.throw();
    });
  });

  describe('noopTypeIsEmptyObject', () => {
    it('should do nothing at runtime', () => {
      (() => {
        noopTypeIsEmptyObject({}, true);
        noopTypeIsEmptyObject({ a: 1 }, false);
      }).should.not.throw();
    });
  });
});
