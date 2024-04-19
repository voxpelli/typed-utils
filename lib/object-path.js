/**
 * @overload
 * @param {unknown} obj
 * @param {string} path
 * @param {false} [createIfMissing]
 * @returns {Record<string, unknown>|undefined|false}
 */
/**
 * @overload
 * @param {unknown} obj
 * @param {string} path
 * @param {true} createIfMissing
 * @returns {Record<string, unknown>|false}
 */
/**
 * @param {unknown} obj
 * @param {string} path
 * @param {boolean} [createIfMissing]
 * @returns {Record<string, unknown>|undefined|false}
 */
export function getObjectValueByPath (obj, path, createIfMissing) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  let currentValue = /** @type {Record<string, unknown>} */ (obj);

  for (const key of path.split('.')) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      throw new Error(`Do not include "${key}" in your path`);
    }

    const nextValue = currentValue[key];

    if (nextValue === undefined) {
      if (!createIfMissing) {
        return;
      }
      /** @type {Record<string, unknown>} */
      const newValue = {};
      currentValue[key] = newValue;
      currentValue = newValue;
    } else if (nextValue && typeof nextValue === 'object') {
      currentValue = /** @type {Record<string, unknown>} */ (nextValue);
    } else {
      return false;
    }
  }

  return currentValue;
}

/**
 * @param {unknown} obj
 * @param {string} path
 * @returns {{ value: unknown; }|undefined|false}
 */
export function getValueByPath (obj, path) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const pathKeys = path.split('.');
  const finalKey = pathKeys.pop();

  if (!finalKey) {
    return;
  }

  if (finalKey === '__proto__' || finalKey === 'constructor' || finalKey === 'prototype') {
    throw new Error(`Do not include "${finalKey}" in your path`);
  }

  const objectValue = pathKeys.length
    ? getObjectValueByPath(obj, pathKeys.join('.'))
    : /** @type {Record<string, unknown>} */ (obj);

  if (!objectValue) {
    return objectValue;
  }

  const value = objectValue[finalKey];

  return value === undefined
    ? undefined
    : { value };
}

/**
 * @param {unknown} obj
 * @param {string} path
 * @returns {string|undefined|false}
 */
export function getStringValueByPath (obj, path) {
  const result = getValueByPath(obj, path);

  if (typeof result !== 'object') {
    return result;
  }

  return typeof result.value === 'string'
    ? result.value
    : false;
}
