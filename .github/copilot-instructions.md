# Copilot / AI Assistant Project Instructions

## Overview

This is a **utility library module** providing type-safe structural and narrowing helpers for TypeScript/JavaScript projects. It follows the voxpelli Node.js module style with ESM, JSDoc types, and strict type coverage.

Focus: preserve existing runtime + type guarantees, stay minimal, be humane (HUG: Humane, Usable, Guided).

## Core Shape
- Pure ESM util library: `index.js → lib/main.js → individual modules` (public API = everything re-exported in `lib/main.js`).
- Source-of-truth is hand‑written JS + JSDoc; `.d.ts` generated via `npm run build` (tsc). Keep JSDoc perfectly synced with runtime logic.
- Scope: generic structural + type narrowing helpers (arrays, objects, guards, assertions, paths, sets, type utilities). No business logic, no heavy deps.
- Shared type definitions live in `lib/types/*.d.ts` (e.g., `literal-types.d.ts`, `string-types.d.ts`, `misc-types.d.ts`)—these are hand-written and committed.
- Runtime engines specify the verified Node range (see `engines` in `package.json`), but library code MUST stay platform‑neutral: avoid Node‑only built‑ins (`fs`, `path`, `process.env`, `Buffer`, etc.) and Node‑specific deps so it can be bundled for browsers. Stick to standard ECMAScript + harmless globals (eg. `Array`, `Set`, `Error`). If a feature would require a Node API, reconsider or make it optional behind user-provided functions.

## Code Style and Standards

1. **JavaScript Style**
   - Use ESM (ECMAScript Modules) syntax exclusively (`import`/`export`)
   - Follow [neostandard](https://github.com/neostandard/neostandard) JavaScript style guide
   - Use single quotes for strings
   - Include semicolons
   - 2-space indentation

2. **Type Safety**
   - Use TypeScript for type definitions but write JavaScript for implementation
   - Include JSDoc comments with type annotations
   - Maintain strict type coverage (≥99%)
   - Generate `.d.ts` files from JSDoc annotations
   - Import shared helper types inline: `import('./types/literal-types.js').LiteralTypes`, `LiteralTypeOf`, `import('./types/string-types.js').NonGenericString`

3. **Module Structure**
   - Main entry point: `index.js` (re-exports from lib/main.js)
   - Implementation: `lib/*.js` files
   - Keep index.js minimal - just re-exports

## Typing & Guards
- Use JSDoc `@template` + constrained generics (see `array.js`, `object.js`).
- Import shared helper types inline: `import('./types/literal-types.js').LiteralTypes`, `LiteralTypeOf`, `import('./types/string-types.js').NonGenericString`.
- Every `value is X` guard must fully validate at runtime (mirror `is.js`, `isArrayOfType`, `typesafeIsArray`).
- Assertions must throw `TypeHelpersAssertionError` (see `assert.js`) and use `asserts` return types.
- Array narrowing: replicate `filter()` pattern (exclude literal) or `filterWithCallback()` (predicate guard). Use targeted casts on push only—never widen with `any`.

## Testing

1. **Test Framework**
   - Use Mocha for test runner
   - Use Chai for assertions
   - Place tests in `test/` directory with `.spec.js` extension
   - Add runtime spec (`test/*.spec.js`) and type test (`typetests/*.test.ts`) with positive + `// @ts-expect-error` cases

2. **Code Coverage**
   - Use c8 for coverage reporting
   - Aim for high coverage on new code
   - Coverage reports generated in LCOV and text formats

3. **Running Tests**
   - `npm test` - Full test suite with checks
   - `npm run test:mocha` - Just the tests
   - `npm run check` - Linting and type checking only

## Implementation Rules
- No mutation of caller inputs except documented creation in `getObjectValueByPath(..., true)`.
- Path utilities MUST reject `__proto__`, `constructor`, `prototype` (prototype pollution guard).
- Path result semantics: `false` = encountered non-object / invalid traversal; `undefined` = path/key absent; object / value otherwise.
- `FrozenSet`: all mutators throw (never silent). Keep immutability contract.
- Keep functions tiny, pure, explicit; reuse `explainVariable()` for diagnostics.

## Adding / Changing Exports
1. Confirm fits scope + adds meaningful type narrowing.
2. Implement in `lib/<area>.js` (or new file) and export via `lib/main.js` (logical grouping + light alphabetical care).
3. Add runtime spec (`test/*.spec.js`) and type test (`typetests/*.test.ts`) with positive + `// @ts-expect-error` cases.
4. Maintain type coverage ≥99% (enforced). Run `npm run check` locally before PR.
5. If signature change: update JSDoc, rebuild declarations, adjust tests.

## Code Quality Tools

1. **ESLint**
   - Configuration: `eslint.config.js`
   - Based on `@voxpelli/eslint-config`
   - Run: `npm run check:1:lint`
   - Fix automatically when possible

2. **TypeScript Checking**
   - Run: `npm run check:1:tsc`
   - Ensures type correctness without compilation
   - Check type coverage: `npm run check:1:type-coverage`

3. **Knip**
   - Detects unused files, dependencies, and exports
   - Run: `npm run check:1:knip`

4. **Dependency Hygiene**
   - Use `installed-check` to verify dependency hygiene
   - Run: `npm run check:1:installed-check`

## Scripts & Quality Gates
- Fast verify: `npm run check` (clean, lint, types, knip, type-coverage, tsd build cycle).
- Full tests: `npm test` (adds mocha + coverage). CI relies on `check` + `test-ci`.
- Only run `npm run build` for generating `.d.ts` (prepack). Do NOT commit extraneous build artifacts.

## Dependencies

1. **Adding Dependencies**
   - Avoid adding dependencies unless absolutely necessary
   - Prefer modern Node.js built-in APIs
   - Production dependencies should be minimal
   - Runtime dep list is intentionally tiny

2. **Development Dependencies**
   - Keep devDependencies up to date via Renovate
   - Use `installed-check` to verify dependency hygiene
   - Use `knip` to detect unused dependencies

## Node.js Version Support

- Required versions: `^20.11.0 || >=22.0.0` (see `engines` in package.json)
- Target latest LTS versions
- Use modern JavaScript features available in these versions
- No transpilation needed

## Errors & Messages
- Error text should name offending key/value (see `assertType`, `assertObjectWithKey`). Prefer clarity over brevity.

## TODO / FIXME Conventions
- Prefer expiring TODOs (date / engine / version) when temporary. Plain TODOs allowed but should be pruned.
- `FIXME` may remain as warnings; don’t auto-remove unless trivially resolvable.
- For AI review prompts use `TODO(ai):` for human follow-up.

## Do / Don’t

**Anti-Patterns to Avoid:**
- ❌ DON'T introduce TS source files (JS + JSDoc only).
- ❌ DON'T broaden to `any` or weaken guard semantics.
- ❌ DON'T leak undocumented mutations.
- ❌ DON'T add Node‑only dependencies or APIs that block browser bundling.
- ❌ DON'T use CommonJS (`require`/`module.exports`).
- ❌ DON'T skip type annotations in JSDoc.
- ❌ DON'T commit auto-generated `.d.ts` files (only commit hand-written ones like `index.d.ts` and those in `lib/types/`).
- ❌ DON'T skip tests for new functionality.

**Best Practices:**
- ✅ DO keep JSDoc generics + literal exclusions precise.
- ✅ DO reuse existing patterns (guards, path checks, immutability).
- ✅ DO minimize dependencies (runtime dep list is intentionally tiny).
- ✅ DO write clear JSDoc comments with types.
- ✅ DO export everything through `lib/main.js`.
- ✅ DO keep functions tiny, pure, explicit; reuse `explainVariable()` for diagnostics.
- ✅ DO use async/await for asynchronous operations.
- ✅ DO validate inputs and provide helpful error messages.
- ✅ DO follow the existing code style consistently.

## Example Guard Pattern
```js
/** @param {unknown} v @returns {v is string} */
function isString (v) { return typeof v === 'string'; }
/** @param {unknown[]} a @returns {string[]} */
export function onlyStrings (a) { return a.filter(isString); }
```

## When Unsure
Mirror similar existing code; ask instead of guessing—add a `TODO(ai): clarify <question>` if blocked.
