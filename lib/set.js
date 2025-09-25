export class FrozenSet extends Set {
  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * @deprecated
   * @override
   * @param {never} _value
   * @returns {this}
   */
  add (_value) {
    throw new TypeError('FrozenSet is frozen / immutable.');
  }

  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * @deprecated
   * @override
   * @param {never} _value
   * @returns {boolean}
   */
  delete (_value) {
    throw new TypeError('FrozenSet is frozen / immutable.');
  }

  /**
   * @deprecated
   * @override
   */
  clear () {
    throw new TypeError('FrozenSet is frozen / immutable.');
  }
}
