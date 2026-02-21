/* eslint-disable jsdoc/check-tag-names */

/** @type {WeakSet<FrozenSet<unknown>>} */
const frozen = new WeakSet();

/**
 * @template T
 * @extends {Set<T>}
 */
export class FrozenSet extends Set {
  /**
   *
   * @param  {Iterable<T>} [values]
   */
  constructor (values) {
    super(values);

    frozen.add(this);
  }

  /**
   * @deprecated
   * @override
   * @param {never} value
   * @returns {this}
   */
  add (value) {
    if (frozen.has(this)) throw new TypeError('Cannot modify frozen set');
    return super.add(value);
  }

  // eslint-disable-next-line jsdoc/require-returns-check
  /**
   * @deprecated
   * @override
   * @param {never} _value
   * @returns {boolean}
   */
  delete (_value) {
    throw new TypeError('Cannot modify frozen set');
  }

  /**
   * @deprecated
   * @override
   */
  clear () {
    throw new TypeError('Cannot modify frozen set');
  }
}
