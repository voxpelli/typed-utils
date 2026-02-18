import { typesafeIsArray, typesafeIsReadonlyArray } from './array.js';
import { isOptionalKeyWithType, isType } from './is.js';
import { explainVariable } from './misc.js';
import { getObjectValueByPath, getValueByPath } from './object-path.js';

/** @import { LiteralTypes } from './types/literal-types.d.ts' */

export class TypeHelpersAssertionError extends Error {
  /**
   * @param {string} message
   * @param {{ stackStartFn?: (...args: any[]) => any }} [options]
   */
  constructor (message, { stackStartFn } = {}) {
    super(message);

    /** @type {string} */
    this.name = 'TypeHelpersAssertionError';

    // @ts-ignore No types for this outside of Node.js
    if (Error.captureStackTrace) {
      // @ts-ignore No types for this outside of Node.js
      Error.captureStackTrace(this, stackStartFn || TypeHelpersAssertionError);
    }
  }
}

/**
 * @param {boolean} condition
 * @param {string} message
 * @returns {asserts condition}
 */
export function assert (condition, message) {
  if (!condition) {
    throw new TypeHelpersAssertionError(message, { stackStartFn: assert });
  }
}

/**
 * @param {unknown} obj
 * @returns {asserts obj is LiteralTypes['object']}
 */
export function assertObject (obj) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeHelpersAssertionError(`Expected an object, but got: ${explainVariable(obj)}`);
  }
}

/**
 * @template {string} K
 * @param {unknown} obj
 * @param {K} key
 * @returns {asserts obj is Record<K, unknown>}
 */
export function assertObjectWithKey (obj, key) {
  assertObject(obj);

  if (!(key in obj)) {
    throw new TypeHelpersAssertionError(`Expected key "${key}" to exist in object`);
  }
}

/**
 * @template {keyof LiteralTypes} T
 * @param {unknown} value
 * @param {T} type
 * @param {string} [message]
 * @returns {asserts value is LiteralTypes[T]}
 */
export function assertType (value, type, message) {
  assert(
    isType(value, type),
    (message || `Expected type "${type}", but got:`) + ' ' + explainVariable(value)
  );
}

/**
 * @template {string} K
 * @template {keyof LiteralTypes} T
 * @param {unknown} obj
 * @param {K} key
 * @param {T} type
 * @returns {asserts obj is Record<K, LiteralTypes[T]>}
 */
export function assertKeyWithType (obj, key, type) {
  assertObjectWithKey(obj, key);

  assertType(
    obj[key],
    type,
    `Expected key "${key}" to have type "${type}", but got:`
  );
}

/**
 * @template {string} K
 * @template {keyof LiteralTypes} T
 * @param {unknown} obj
 * @param {K} key
 * @param {T} type
 * @returns {asserts obj is Partial<Record<K, LiteralTypes[T]>>}
 */
export function assertOptionalKeyWithType (obj, key, type) {
  assertObject(obj);

  if (!isOptionalKeyWithType(obj, key, type)) {
    assertObjectWithKey(obj, key);

    throw new TypeHelpersAssertionError(`Expected existing key "${key}" to be undefined or have type "${type}", but got: ${explainVariable(obj[key])}`);
  }
}

/**
 * @template {keyof LiteralTypes} T
 * @param {unknown} value
 * @param {T} type
 * @param {string} [message]
 * @returns {asserts value is Array<LiteralTypes[T]>}
 */
export function assertArrayOfLiteralType (value, type, message) {
  for (const item of typesafeIsArray(value) ? value : []) {
    assertType(item, type, message);
  }
}

/**
 * @template {keyof LiteralTypes} T
 * @param {unknown} obj
 * @param {T} type
 * @returns {asserts obj is Record<string, LiteralTypes[T]>}
 */
export function assertObjectValueType (obj, type) {
  assertObject(obj);

  assertArrayOfLiteralType(
    Object.values(obj),
    type,
    `Expected object values to have type "${type}", but got:`
  );

  assertArrayOfLiteralType(
    Object.keys(obj),
    'string',
    'Expected object keys to be string, but got:'
  );
}

/**
 * Asserts that a path in an object resolves to an object value.
 *
 * Throws a TypeHelpersAssertionError if the path doesn't exist or doesn't
 * resolve to an object. Use this when you need to guarantee a nested object
 * structure exists before accessing its properties.
 *
 * @template T - The object type being asserted
 * @param {T} obj - The object to check
 * @param {string[]|readonly string[]|string} path - Path as dot-separated string or array of keys
 * @returns {asserts obj is import('./types/path-types.d.ts').PathAssertedSimple<T>} Throws if assertion fails
 * @throws {TypeHelpersAssertionError} If path doesn't exist or isn't an object
 * @example Basic usage with string path
 * ```javascript
 * const config = { server: { port: 3000 } };
 *
 * assertObjectWithPath(config, 'server');
 * // Now safe to access config.server.port
 * console.log(config.server.port);
 * ```
 * @example Validate deeply nested structures
 * ```javascript
 * const data = { user: { profile: { settings: { theme: 'dark' } } } };
 *
 * assertObjectWithPath(data, 'user.profile.settings');
 * // Guaranteed to exist and be an object
 * console.log(data.user.profile.settings.theme);
 * ```
 * @example Using array paths
 * ```javascript
 * const app = { config: { database: { connection: {} } } };
 *
 * assertObjectWithPath(app, ['config', 'database']);
 * // Path validated, safe to access
 * ```
 * @example Error handling
 * ```javascript
 * try {
 *   const settings = { theme: 'dark' };
 *   assertObjectWithPath(settings, 'user.profile');
 * } catch (err) {
 *   console.error('Missing user profile configuration');
 *   // Error: Expected path "user.profile" to exist and be an object
 * }
 * ```
 * @example With readonly array paths
 * ```javascript
 * const state = { app: { ui: { modal: { visible: false } } } };
 *
 * assertObjectWithPath(state, ['app', 'ui', 'modal'] as const);
 * console.log(state.app.ui.modal.visible);
 * ```
 * @example Validating before modification
 * ```javascript
 * function updateServerPort(config, newPort) {
 *   assertObjectWithPath(config, 'server');
 *   config.server.port = newPort;
 * }
 * ```
 * @see {@link isObjectWithPath} - Type guard variant that returns boolean
 * @see {@link assertPathWithType} - Assert path exists with specific type
 * @see {@link assertPathWithValue} - Assert path exists with specific value
 * @see {@link getObjectValueByPath} - Retrieve object at path without assertion
 */
export function assertObjectWithPath (obj, path) {
  const result = getObjectValueByPath(obj, path);

  if (!result || typeof result !== 'object') {
    const pathStr = typesafeIsReadonlyArray(path) ? path.join('.') : path;
    throw new TypeHelpersAssertionError(`Expected path "${pathStr}" to exist and be an object, but got: ${explainVariable(result)}`);
  }
}

/**
 * Asserts that a value at a path matches a specific literal type.
 *
 * Throws a TypeHelpersAssertionError if the path doesn't exist or if the
 * value at that path doesn't match the specified literal type. Use this to
 * enforce type constraints on nested values at runtime.
 *
 * @template T - The object type being asserted
 * @template {keyof LiteralTypes} K - The literal type to assert
 * @param {T} obj - The object to check
 * @param {string[]|readonly string[]|string} path - Path as dot-separated string or array of keys
 * @param {K} type - The literal type expected ('string', 'number', 'boolean', 'null', 'array', 'object', etc.)
 * @returns {asserts obj is import('./types/path-types.d.ts').PathAssertedSimple<T>} Throws if assertion fails
 * @throws {TypeHelpersAssertionError} If path doesn't exist or type doesn't match
 * @example Assert string type
 * ```javascript
 * const config = { server: { host: 'localhost', port: 3000 } };
 *
 * assertPathWithType(config, 'server.host', 'string');
 * // Guaranteed to be a string, safe to use string methods
 * const upperHost = config.server.host.toUpperCase();
 * ```
 * @example Assert number type
 * ```javascript
 * const settings = { timeout: 5000, retries: 3 };
 *
 * assertPathWithType(settings, 'timeout', 'number');
 * // Guaranteed to be a number
 * const seconds = settings.timeout / 1000;
 * ```
 * @example Assert array type
 * ```javascript
 * const data = { items: [1, 2, 3], metadata: {} };
 *
 * assertPathWithType(data, 'items', 'array');
 * // Safe to use array methods
 * console.log(data.items.length);
 * ```
 * @example Using array paths
 * ```javascript
 * const app = { config: { database: { pool: { max: 10 } } } };
 *
 * assertPathWithType(app, ['config', 'database', 'pool', 'max'], 'number');
 * console.log(app.config.database.pool.max * 2);
 * ```
 * @example Error handling
 * ```javascript
 * try {
 *   const config = { port: '8080' }; // Oops, string instead of number
 *   assertPathWithType(config, 'port', 'number');
 * } catch (err) {
 *   console.error('Invalid configuration:', err.message);
 *   // Error: Expected path "port" to have type "number", but got: string
 * }
 * ```
 * @example Validate before processing
 * ```javascript
 * function processConfig(config) {
 *   assertPathWithType(config, 'server.port', 'number');
 *   assertPathWithType(config, 'server.host', 'string');
 *   assertPathWithType(config, 'features', 'array');
 *
 *   // Now safe to use these values with confidence
 *   startServer(config.server.host, config.server.port);
 * }
 * ```
 * @example With readonly paths
 * ```javascript
 * const state = { user: { isActive: true, role: 'admin' } };
 *
 * assertPathWithType(state, ['user', 'isActive'] as const, 'boolean');
 * if (state.user.isActive) {
 *   console.log('User is active');
 * }
 * ```
 * @see {@link isPathWithType} - Type guard variant that returns boolean
 * @see {@link assertPathWithValue} - Assert specific value instead of type
 * @see {@link assertType} - Assert type without path navigation
 * @see {@link getValueByPath} - Retrieve value at path without assertion
 */
export function assertPathWithType (obj, path, type) {
  const result = getValueByPath(obj, path);

  if (typeof result !== 'object' || !result) {
    const pathStr = typesafeIsReadonlyArray(path) ? path.join('.') : path;
    throw new TypeHelpersAssertionError(`Expected path "${pathStr}" to exist, but got: ${explainVariable(result)}`);
  }

  assertType(
    result.value,
    type,
    `Expected path "${typesafeIsReadonlyArray(path) ? path.join('.') : path}" to have type "${type}", but got:`
  );
}

/**
 * Asserts that a value at a path matches a specific expected value.
 *
 * Throws a TypeHelpersAssertionError if the path doesn't exist or if the
 * value at that path is not strictly equal (===) to the expected value.
 * Use this to validate configuration values, flags, or specific states.
 *
 * @template T - The object type being asserted
 * @param {T} obj - The object to check
 * @param {string[]|readonly string[]|string} path - Path as dot-separated string or array of keys
 * @param {unknown} expectedValue - The exact value expected (strict equality check)
 * @returns {asserts obj is import('./types/path-types.d.ts').PathAssertedSimple<T>} Throws if assertion fails
 * @throws {TypeHelpersAssertionError} If path doesn't exist or value doesn't match
 * @example Assert configuration values
 * ```javascript
 * const config = { env: 'production', debug: false };
 *
 * assertPathWithValue(config, 'env', 'production');
 * // Guaranteed to be in production mode
 * console.log('Running in production');
 * ```
 * @example Assert feature flags
 * ```javascript
 * const features = { darkMode: true, analytics: false, beta: true };
 *
 * assertPathWithValue(features, 'darkMode', true);
 * // Dark mode is confirmed enabled
 * enableDarkTheme();
 * ```
 * @example Assert numeric values
 * ```javascript
 * const settings = { version: 2, apiVersion: 'v2' };
 *
 * assertPathWithValue(settings, 'version', 2);
 * // Version confirmed
 * ```
 * @example Using nested paths
 * ```javascript
 * const app = {
 *   database: {
 *     connection: {
 *       pool: { min: 2, max: 10 }
 *     }
 *   }
 * };
 *
 * assertPathWithValue(app, 'database.connection.pool.max', 10);
 * // Pool max confirmed at default value
 * ```
 * @example Using array paths
 * ```javascript
 * const state = { user: { role: 'admin', active: true } };
 *
 * assertPathWithValue(state, ['user', 'role'], 'admin');
 * // User role confirmed as admin
 * grantAdminAccess();
 * ```
 * @example Error handling
 * ```javascript
 * try {
 *   const config = { mode: 'development' };
 *   assertPathWithValue(config, 'mode', 'production');
 * } catch (err) {
 *   console.error('Not in production mode:', err.message);
 *   // Error: Expected path "mode" to have value "production", but got: "development"
 * }
 * ```
 * @example Validating required settings
 * ```javascript
 * function initializeApp(config) {
 *   assertPathWithValue(config, 'initialized', false);
 *   assertPathWithValue(config, 'server.port', 8080);
 *   assertPathWithValue(config, 'server.host', 'localhost');
 *
 *   // Safe to proceed with initialization
 *   startServer(config);
 * }
 * ```
 * @example With readonly paths
 * ```javascript
 * const settings = { theme: { mode: 'dark', contrast: 'high' } };
 *
 * assertPathWithValue(settings, ['theme', 'mode'] as const, 'dark');
 * applyDarkTheme();
 * ```
 * @example Checking null values
 * ```javascript
 * const response = { data: null, error: null };
 *
 * assertPathWithValue(response, 'error', null);
 * // Confirmed no error
 * processData(response.data);
 * ```
 * @see {@link isPathWithValue} - Type guard variant that returns boolean
 * @see {@link assertPathWithType} - Assert type instead of specific value
 * @see {@link getValueByPath} - Retrieve value at path without assertion
 */
export function assertPathWithValue (obj, path, expectedValue) {
  const result = getValueByPath(obj, path);

  if (typeof result !== 'object' || !result) {
    const pathStr = typesafeIsReadonlyArray(path) ? path.join('.') : path;
    throw new TypeHelpersAssertionError(`Expected path "${pathStr}" to exist, but got: ${explainVariable(result)}`);
  }

  if (result.value !== expectedValue) {
    const pathStr = typesafeIsReadonlyArray(path) ? path.join('.') : path;
    // Use JSON.stringify for better representation of values
    const expectedStr = typeof expectedValue === 'string' ? `"${expectedValue}"` : String(expectedValue);
    const actualStr = typeof result.value === 'string' ? `"${result.value}"` : String(result.value);
    throw new TypeHelpersAssertionError(`Expected path "${pathStr}" to have value ${expectedStr}, but got: ${actualStr}`);
  }
}
