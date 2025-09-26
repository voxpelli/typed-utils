# Copilot / AI Assistant Project Instructions

Focus: preserve existing runtime + type guarantees, stay minimal, be humane (HUG: Humane, Usable, Guided).

## Core Shape
- Pure ESM util library: `index.js → lib/main.js → individual modules` (public API = everything re-exported in `lib/main.js`).
- Source-of-truth is hand‑written JS + JSDoc; `.d.ts` generated via `npm run build` (tsc). Keep JSDoc perfectly synced with runtime logic.
- Scope: generic structural + type narrowing helpers (arrays, objects, guards, assertions, paths, sets). No business logic, no heavy deps.
- Runtime engines specify the verified Node range (see `engines` in `package.json`), but library code MUST stay platform‑neutral: avoid Node‑only built‑ins (`fs`, `path`, `process.env`, `Buffer`, etc.) and Node‑specific deps so it can be bundled for browsers. Stick to standard ECMAScript + harmless globals (eg. `Array`, `Set`, `Error`). If a feature would require a Node API, reconsider or make it optional behind user-provided functions.

## Typing & Guards
- Use JSDoc `@template` + constrained generics (see `array.js`, `object.js`).
- Import shared helper types inline: `import('@voxpelli/type-helpers').LiteralTypes`, `LiteralTypeOf`, `NonGenericString`.
- Every `value is X` guard must fully validate at runtime (mirror `is.js`, `isArrayOfType`, `typesafeIsArray`).
- Assertions must throw `TypeHelpersAssertionError` (see `assert.js`) and use `asserts` return types.
- Array narrowing: replicate `filter()` pattern (exclude literal) or `filterWithCallback()` (predicate guard). Use targeted casts on push only—never widen with `any`.

## Implementation Rules
- No mutation of caller inputs except documented creation in `getObjectValueByPath(..., true)`.
- Path utilities MUST reject `__proto__`, `constructor`, `prototype` (prototype pollution guard).
- Path result semantics: `false` = encountered non-object / invalid traversal; `undefined` = path/key absent; object / value otherwise.
- `FrozenSet`: all mutators throw (never silent). Keep immutability contract.
- Keep functions tiny, pure, explicit; reuse `explainVariable()` for diagnostics.

## Adding / Changing Exports
1. Confirm fits scope + adds meaningful type narrowing.
2. Implement in `lib/<area>.js` (or new file) and export via `lib/main.js` (logical grouping + light alphabetical care).
3. Add runtime spec (`test/*.spec.js`) and type test (`test-d/*.test-d.ts`) with positive + `// @ts-expect-error` cases.
4. Maintain type coverage ≥99% (enforced). Run `npm run check` locally before PR.
5. If signature change: update JSDoc, rebuild declarations, adjust tests.

## Scripts & Quality Gates
- Fast verify: `npm run check` (clean, lint, types, knip, type-coverage, tsd build cycle).
- Full tests: `npm test` (adds mocha + coverage). CI relies on `check` + `test-ci`.
- Only run `npm run build` for generating `.d.ts` (prepack). Do NOT commit extraneous build artifacts.

## Errors & Messages
- Error text should name offending key/value (see `assertType`, `assertObjectWithKey`). Prefer clarity over brevity.

## TODO / FIXME Conventions
- Prefer expiring TODOs (date / engine / version) when temporary. Plain TODOs allowed but should be pruned.
- `FIXME` may remain as warnings; don’t auto-remove unless trivially resolvable.
- For AI review prompts use `TODO(ai):` for human follow-up.

## Do / Don’t
- DO keep JSDoc generics + literal exclusions precise.
- DO reuse existing patterns (guards, path checks, immutability).
- DO minimize dependencies (runtime dep list is intentionally tiny).
- DON’T introduce TS source files (JS + JSDoc only).
- DON’T broaden to `any` or weaken guard semantics.
- DON’T leak undocumented mutations.
- DON’T add Node‑only dependencies or APIs that block browser bundling.

## Example Guard Pattern
```js
/** @param {unknown} v @returns {v is string} */
function isString (v) { return typeof v === 'string'; }
/** @param {unknown[]} a @returns {string[]} */
export function onlyStrings (a) { return a.filter(isString); }
```

## When Unsure
Mirror similar existing code; ask instead of guessing—add a `TODO(ai): clarify <question>` if blocked.
