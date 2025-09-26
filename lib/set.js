/* eslint-disable jsdoc/check-tag-names */
/**
 * @template T
 * @extends {Set<T>}
 */
export class FrozenSet extends Set {
  frozen = false;

  /**
   *
   * @param  {readonly T[]} values
   */
  constructor (values) {
    super(values);

    this.frozen = true;
  }

  /**
   * @deprecated
   * @override
   * @param {never} value
   * @returns {this}
   */
  add (value) {
    if (this.frozen) throw new TypeError('Cannot modify frozen set');
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
