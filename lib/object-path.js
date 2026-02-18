/**
 * @overload
 * @param {unknown} obj
 * @param {string[]|string} path
 * @param {false} [createIfMissing]
 * @returns {Record<string, unknown>|undefined|false}
 */
/**
 * @overload
 * @param {unknown} obj
 * @param {string[]|string} path
 * @param {true} createIfMissing
 * @returns {Record<string, unknown>|false}
 */
/**
 * @param {unknown} obj
 * @param {string[]|string} path
 * @param {boolean} [createIfMissing]
 * @returns {Record<string, unknown>|undefined|false}
 */
export function getObjectValueByPath (obj, path, createIfMissing) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const pathKeys = Array.isArray(path) ? [...path] : path.split('.');

  let currentValue = /** @type {Record<string, unknown>} */ (obj);

  for (const key of pathKeys) {
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
 * @param {string[]|string} path
 * @returns {{ value: unknown; }|undefined|false}
 */
export function getValueByPath (obj, path) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const pathKeys = Array.isArray(path) ? [...path] : path.split('.');
  const finalKey = pathKeys.pop();

  if (!finalKey) {
    return;
  }

  if (finalKey === '__proto__' || finalKey === 'constructor' || finalKey === 'prototype') {
    throw new Error(`Do not include "${finalKey}" in your path`);
  }

  const objectValue = pathKeys.length
    ? getObjectValueByPath(obj, pathKeys)
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
 * @param {string[]|string} path
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

/**
 * @param {unknown} obj
 * @param {string[]|string} path
 * @returns {obj is Record<string, unknown>}
 */
export function isObjectWithPath (obj, path) {
  const result = getObjectValueByPath(obj, path);
  return !!(result && typeof result === 'object');
}

/**
 * @template {import('./types/literal-types.d.ts').LiteralTypes} LT
 * @param {unknown} obj
 * @param {string[]|string} path
 * @param {keyof LT} type
 * @returns {obj is Record<string, unknown>}
 */
export function isPathWithType (obj, path, type) {
  const result = getValueByPath(obj, path);

  if (typeof result !== 'object' || !result) {
    return false;
  }

  const { value } = result;

  if (value === null) return type === 'null';
  if (Array.isArray(value)) return type === 'array';
  // eslint-disable-next-line valid-typeof
  return (typeof value) === type;
}

/**
 * @param {unknown} obj
 * @param {string[]|string} path
 * @param {unknown} expectedValue
 * @returns {obj is Record<string, unknown>}
 */
export function isPathWithValue (obj, path, expectedValue) {
  const result = getValueByPath(obj, path);

  if (typeof result !== 'object' || !result) {
    return false;
  }

  return result.value === expectedValue;
}
