export type LiteralTypeOf<T> =
  T extends string ? 'string' :
  T extends number ? 'number' :
  T extends bigint ? 'bigint' :
  T extends boolean ? 'boolean' :
  T extends symbol ? 'symbol' :
  T extends undefined ? 'undefined' :
  T extends null ? 'null' :
  T extends any[] ? 'array' :
  T extends () => any ? 'function' :
  T extends object ? 'object' :
  never;

export type LiteralTypes = {
  'string': string,
  'number': number,
  'bigint': bigint,
  'boolean': boolean,
  'symbol': symbol,
  'undefined': undefined,
  'null': null,
  'array': unknown[],
  'object': Record<string, unknown>,
  'function': () => unknown,
};
