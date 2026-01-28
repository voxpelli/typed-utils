// Borrowed from https://github.com/sindresorhus/type-fest

declare const emptyObjectSymbol: unique symbol;
type EmptyObject = { [emptyObjectSymbol]?: never };
export type IsEmptyObject<T> = T extends EmptyObject ? true : false;
