import { typesafeIsReadonlyArray } from './array.js';

/**
 * @overload
 * @param {unknown} obj
 * @param {string[]|readonly string[]|string} path
 * @param {false} [createIfMissing]
 * @returns {Record<string, unknown>|undefined|false}
 */
/**
 * @overload
 * @param {unknown} obj
 * @param {string[]|readonly string[]|string} path
 * @param {true} createIfMissing
 * @returns {Record<string, unknown>|false}
 */
/**
 * @param {unknown} obj
 * @param {string[]|readonly string[]|string} path
 * @param {boolean} [createIfMissing]
 * @returns {Record<string, unknown>|undefined|false}
 */
export function getObjectValueByPath (obj, path, createIfMissing) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const pathKeys = typesafeIsReadonlyArray(path)
    ? [...path]
    : path.split('.');

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
 * @param {string[]|readonly string[]|string} path
 * @returns {{ value: unknown; }|undefined|false}
 */
export function getValueByPath (obj, path) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const pathKeys = typesafeIsReadonlyArray(path)
    ? [...path]
    : path.split('.');
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
 * @param {string[]|readonly string[]|string} path
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
 * Type guard to check if a path in an object resolves to an object value.
 *
 * Validates that the specified path exists in the object and that the
 * value at that path is itself an object (not null, array, or primitive).
 * Narrows the type to preserve the original object type structure.
 *
 * @template T - The object type being checked
 * @param {T} obj - The object to check
 * @param {string[]|readonly string[]|string} path - Path as dot-separated string or array of keys
 * @returns {obj is import('./types/path-types.d.ts').PathNarrowedSimple<T>} True if path exists and resolves to an object
 * @example String path
 * ```javascript
 * const config = { server: { port: 3000 } };
 * if (isObjectWithPath(config, 'server')) {
 *   // config is narrowed, path validated at runtime
 *   console.log(config.server.port);
 * }
 * ```
 * @example Array path
 * ```javascript
 * const data = { user: { profile: { name: 'Alice' } } };
 * if (isObjectWithPath(data, ['user', 'profile'])) {
 *   console.log(data.user.profile.name);
 * }
 * ```
 * @example Readonly array path (with const assertion)
 * ```javascript
 * const settings = { theme: { colors: { primary: '#007bff' } } };
 * if (isObjectWithPath(settings, ['theme', 'colors'] as const)) {
 *   console.log(settings.theme.colors.primary);
 * }
 * ```
 * @see {@link assertObjectWithPath} - Assertion variant that throws on failure
 * @see {@link getObjectValueByPath} - Retrieve the object at the path
 */
export function isObjectWithPath (obj, path) {
  const result = getObjectValueByPath(obj, path);
  return !!(result && typeof result === 'object');
}

/**
 * Type guard to check if a value at a path matches a specific literal type.
 *
 * Validates that the path exists and that the value at that path matches
 * the specified literal type (e.g., 'string', 'number', 'boolean', 'array', etc.).
 * Narrows the object type while preserving its original structure.
 *
 * @template T - The object type being checked
 * @template {keyof import('./types/literal-types.d.ts').LiteralTypes} K - The literal type to check for
 * @param {T} obj - The object to check
 * @param {string[]|readonly string[]|string} path - Path as dot-separated string or array of keys
 * @param {K} type - The literal type to check ('string', 'number', 'boolean', 'null', 'array', 'object', etc.)
 * @returns {obj is import('./types/path-types.d.ts').PathNarrowedSimple<T>} True if path exists with matching type
 * @example Check for string type
 * ```javascript
 * const config = { server: { host: 'localhost', port: 3000 } };
 *
 * if (isPathWithType(config, 'server.host', 'string')) {
 *   // config is narrowed, we know server.host is a string
 *   console.log(config.server.host.toUpperCase());
 * }
 *
 * if (isPathWithType(config, 'server.port', 'number')) {
 *   // config is narrowed, we know server.port is a number
 *   console.log(config.server.port * 2);
 * }
 * ```
 * @example Check for array type
 * ```javascript
 * const data = { items: [1, 2, 3], name: 'test' };
 *
 * if (isPathWithType(data, 'items', 'array')) {
 *   console.log(data.items.length); // Safe to use array methods
 * }
 * ```
 * @example Using array paths
 * ```javascript
 * const settings = { theme: { mode: 'dark', animations: true } };
 *
 * if (isPathWithType(settings, ['theme', 'animations'], 'boolean')) {
 *   const enabled = settings.theme.animations;
 * }
 * ```
 * @example With readonly array paths
 * ```javascript
 * const user = { profile: { age: 25, verified: false } };
 * const path = ['profile', 'age'] as const;
 *
 * if (isPathWithType(user, path, 'number')) {
 *   console.log(`Age: ${user.profile.age}`);
 * }
 * ```
 * @example Checking for null
 * ```javascript
 * const response = { data: null, error: null };
 *
 * if (isPathWithType(response, 'data', 'null')) {
 *   // Confirmed data is null
 * }
 * ```
 * @see {@link assertPathWithType} - Assertion variant that throws on type mismatch
 * @see {@link isPathWithValue} - Check for a specific value instead of type
 * @see {@link isType} - Check type without path navigation
 * @see {@link getValueByPath} - Retrieve the value at the path
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
 * Type guard to check if a value at a path matches a specific expected value.
 *
 * Validates that the path exists and that the value at that path is strictly
 * equal (===) to the expected value. Useful for checking configuration values,
 * flags, or specific states within nested objects.
 *
 * @template T - The object type being checked
 * @param {T} obj - The object to check
 * @param {string[]|readonly string[]|string} path - Path as dot-separated string or array of keys
 * @param {unknown} expectedValue - The exact value to check for (strict equality)
 * @returns {obj is import('./types/path-types.d.ts').PathNarrowedSimple<T>} True if path exists with matching value
 * @example Check for specific string value
 * ```javascript
 * const config = { env: 'production', debug: false };
 *
 * if (isPathWithValue(config, 'env', 'production')) {
 *   console.log('Running in production mode');
 * }
 * ```
 * @example Check for boolean flags
 * ```javascript
 * const settings = { features: { darkMode: true, analytics: false } };
 *
 * if (isPathWithValue(settings, 'features.darkMode', true)) {
 *   console.log('Dark mode is enabled');
 * }
 * ```
 * @example Check for numeric values
 * ```javascript
 * const data = { server: { port: 8080, maxConnections: 100 } };
 *
 * if (isPathWithValue(data, 'server.port', 8080)) {
 *   console.log('Using default port');
 * }
 * ```
 * @example Using array paths
 * ```javascript
 * const app = { status: { state: 'running', code: 200 } };
 *
 * if (isPathWithValue(app, ['status', 'state'], 'running')) {
 *   console.log('Application is running');
 * }
 * ```
 * @example With readonly paths
 * ```javascript
 * const user = { profile: { role: 'admin', active: true } };
 *
 * if (isPathWithValue(user, ['profile', 'role'] as const, 'admin')) {
 *   console.log('User has admin privileges');
 * }
 * ```
 * @example Checking for null or undefined
 * ```javascript
 * const response = { data: null, error: undefined };
 *
 * if (isPathWithValue(response, 'data', null)) {
 *   console.log('Data is explicitly null');
 * }
 * ```
 * @example Nested object value checks
 * ```javascript
 * const config = {
 *   database: {
 *     connection: {
 *       pool: { min: 2, max: 10 }
 *     }
 *   }
 * };
 *
 * if (isPathWithValue(config, 'database.connection.pool.max', 10)) {
 *   console.log('Using default connection pool size');
 * }
 * ```
 * @see {@link assertPathWithValue} - Assertion variant that throws on mismatch
 * @see {@link isPathWithType} - Check for type instead of specific value
 * @see {@link getValueByPath} - Retrieve the value at the path
 */
export function isPathWithValue (obj, path, expectedValue) {
  const result = getValueByPath(obj, path);

  if (typeof result !== 'object' || !result) {
    return false;
  }

  return result.value === expectedValue;
}
