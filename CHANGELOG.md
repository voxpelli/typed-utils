# Changelog

## [2.4.3](https://github.com/voxpelli/typed-utils/compare/v2.4.2...v2.4.3) (2025-09-29)


### 🩹 Fixes

* clarify types of `guardedArrayIncludes()` ([#54](https://github.com/voxpelli/typed-utils/issues/54)) ([c67f74b](https://github.com/voxpelli/typed-utils/commit/c67f74b6276458aeb3cc60e63bf5b48d8a6f810f))

## [2.4.2](https://github.com/voxpelli/typed-utils/compare/v2.4.1...v2.4.2) (2025-09-26)


### 🩹 Fixes

* guardedArrayIncludes, use `.has()` if a Set ([#52](https://github.com/voxpelli/typed-utils/issues/52)) ([f631f01](https://github.com/voxpelli/typed-utils/commit/f631f016c6e5b3e2ae023e2558fd58f6a8d20fa0))

## [2.4.1](https://github.com/voxpelli/typed-utils/compare/v2.4.0...v2.4.1) (2025-09-26)


### 🩹 Fixes

* `FrozenSet` wasn't working as intended ([2929d35](https://github.com/voxpelli/typed-utils/commit/2929d358d952a3307369efed126cde7ce959c565))


### 🧹 Chores

* **deps:** update dev dependencies ([4d59dae](https://github.com/voxpelli/typed-utils/commit/4d59daeb713722b1a49cc567056ff4cb683e1045))
* fix linting warning ([f049aed](https://github.com/voxpelli/typed-utils/commit/f049aed7ce4d0e5bea41516cea568ef3b2812b94))

## [2.4.0](https://github.com/voxpelli/typed-utils/compare/v2.3.1...v2.4.0) (2025-09-26)


### 🌟 Features

* add `guardedArrayIncludes` ([101a0cf](https://github.com/voxpelli/typed-utils/commit/101a0cf52eec7493d0c8a250d5955b37b3defe27))


### 🧹 Chores

* initial copilot-instructions ([928e498](https://github.com/voxpelli/typed-utils/commit/928e4983cad0153d603a99b8015b2ae0111dda28))

## [2.3.1](https://github.com/voxpelli/typed-utils/compare/v2.3.0...v2.3.1) (2025-09-25)


### 🩹 Fixes

* the type of `FrozenSet` wasn't a generic ([aa702b1](https://github.com/voxpelli/typed-utils/commit/aa702b1fc4cb1f16325bb2cbc45738e4ba249a70))

## [2.3.0](https://github.com/voxpelli/typed-utils/compare/v2.2.2...v2.3.0) (2025-09-25)


### 🌟 Features

* add `FrozenSet` ([#47](https://github.com/voxpelli/typed-utils/issues/47)) ([98c039d](https://github.com/voxpelli/typed-utils/commit/98c039d342af3d7fee63171b6811adc9ed68c226))

## [2.2.2](https://github.com/voxpelli/typed-utils/compare/v2.2.1...v2.2.2) (2025-06-10)


### 🩹 Fixes

* remove one remaining nodejs reliance ([c4fc3af](https://github.com/voxpelli/typed-utils/commit/c4fc3afce7e2f6ae20621b9cf5b82bd17c370a83))

## [2.2.1](https://github.com/voxpelli/typed-utils/compare/v2.2.0...v2.2.1) (2025-06-09)


### 🩹 Fixes

* remove reliance on `node:assert` ([bb570f1](https://github.com/voxpelli/typed-utils/commit/bb570f14b600a36bd47a289ed51a6b806ad5b56b))

## [2.2.0](https://github.com/voxpelli/typed-utils/compare/v2.1.0...v2.2.0) (2025-06-09)


### 🌟 Features

* add `assertOptionalKeyWithType` ([#40](https://github.com/voxpelli/typed-utils/issues/40)) ([4de95dc](https://github.com/voxpelli/typed-utils/commit/4de95dcfc6b9511ee5fb1104e5bbbce3ce2cb1e8))

## [2.1.0](https://github.com/voxpelli/typed-utils/compare/v2.0.1...v2.1.0) (2025-06-09)


### 🌟 Features

* add `isOptionalKeyWithType` ([#35](https://github.com/voxpelli/typed-utils/issues/35)) ([68b780a](https://github.com/voxpelli/typed-utils/commit/68b780a2f3ea4af15f4a10ff76ec9387e877f73b))


### 🧹 Chores

* **deps:** update dependency @types/node to ^18.19.111 ([#37](https://github.com/voxpelli/typed-utils/issues/37)) ([131e057](https://github.com/voxpelli/typed-utils/commit/131e057cb93d510c4c31cdb7e409dda69011fcba))
* **deps:** update dependency knip to ^5.60.2 ([#38](https://github.com/voxpelli/typed-utils/issues/38)) ([b824749](https://github.com/voxpelli/typed-utils/commit/b8247495a6b6d528df4244e1fe198068224b9232))
* **deps:** update dependency mocha to ^11.6.0 ([#39](https://github.com/voxpelli/typed-utils/issues/39)) ([baeb9de](https://github.com/voxpelli/typed-utils/commit/baeb9dec112636d1f5b48f2ed3dbd54c0f6aa151))

## [2.0.1](https://github.com/voxpelli/typed-utils/compare/v2.0.0...v2.0.1) (2025-06-01)


### 📚 Documentation

* improve the readme with new methods ([c802169](https://github.com/voxpelli/typed-utils/commit/c80216996c601bd1de15546794189599a02f7b70))


### 🧹 Chores

* **deps:** update dependency validate-conventional-commit to ^1.0.4 ([#25](https://github.com/voxpelli/typed-utils/issues/25)) ([bc6382d](https://github.com/voxpelli/typed-utils/commit/bc6382d0a5771f317e4efbd9c371cd82ad976769))

## [2.0.0](https://github.com/voxpelli/typed-utils/compare/v1.10.2...v2.0.0) (2025-06-01)


### ⚠ BREAKING CHANGES

* require node.js `^20.11.0 || >=22.0.0`

### 🌟 Features

* add assert and is helpers ([#33](https://github.com/voxpelli/typed-utils/issues/33)) ([ccca2b2](https://github.com/voxpelli/typed-utils/commit/ccca2b2b02bd2419855a82bf80743f3b53f340d3))


### 🧹 Chores

* **deps:** update dependency @voxpelli/eslint-config to v22 ([#30](https://github.com/voxpelli/typed-utils/issues/30)) ([dfddedd](https://github.com/voxpelli/typed-utils/commit/dfddedd7c9fd7c9301f9cd5210d057dfed656006))
* **deps:** update dev dependencies ([e32fe27](https://github.com/voxpelli/typed-utils/commit/e32fe2703a95a107c06888ed9252ab04218ccf4b))
* **deps:** update dev dependencies ([8770ff8](https://github.com/voxpelli/typed-utils/commit/8770ff8e1dfb9f0ab876cb0cfc57e1f94e6f70a8))
* **deps:** update linting dependencies ([#18](https://github.com/voxpelli/typed-utils/issues/18)) ([1cb3b14](https://github.com/voxpelli/typed-utils/commit/1cb3b1430b92b57fcf3767288b0ec7c58bb23c2b))
* **deps:** update test dependencies ([#21](https://github.com/voxpelli/typed-utils/issues/21)) ([1af37ba](https://github.com/voxpelli/typed-utils/commit/1af37ba941587fc02ea858bed087ecfc3ba4f06d))
* **deps:** update type dependencies ([#19](https://github.com/voxpelli/typed-utils/issues/19)) ([925074e](https://github.com/voxpelli/typed-utils/commit/925074ec9abccebafce31b94cb3ca99697d8290e))
* require node.js `^20.11.0 || >=22.0.0` ([4b9e306](https://github.com/voxpelli/typed-utils/commit/4b9e3062d8a38a71fb3d95b5e4a48af745cf325b))
* use modern eslint script command ([c750235](https://github.com/voxpelli/typed-utils/commit/c7502351b0a164f30aed7b7062166a1553374a9e))

## [1.10.2](https://github.com/voxpelli/typed-utils/compare/v1.10.1...v1.10.2) (2024-06-29)


### 🧹 Chores

* **deps:** update dev dependencies ([51a15d1](https://github.com/voxpelli/typed-utils/commit/51a15d11ce8268d51666060de109cfb94b1973b7))
* **deps:** update to neostandard based linting ([734a2ae](https://github.com/voxpelli/typed-utils/commit/734a2ae92faf832a1ed31212827e85c4009c70a5))

## [1.10.1](https://github.com/voxpelli/typed-utils/compare/v1.10.0...v1.10.1) (2024-04-22)


### Bug Fixes

* only `pick` keys that are set ([103bc69](https://github.com/voxpelli/typed-utils/commit/103bc6907de0853fdca969d77a648f738f25c829))

## [1.10.0](https://github.com/voxpelli/typed-utils/compare/v1.9.0...v1.10.0) (2024-04-19)


### Features

* array object paths in `getValueByPath` etc ([a2fb594](https://github.com/voxpelli/typed-utils/commit/a2fb5941718950c593391f0b9961d2f57e5f0aa4))

## [1.9.0](https://github.com/voxpelli/typed-utils/compare/v1.8.0...v1.9.0) (2024-04-19)


### Features

* add `getValueByPath()` and friends ([6c2e298](https://github.com/voxpelli/typed-utils/commit/6c2e298fedece21a4a8ed1584be364a318646675))
* add `isErrorWithCode` ([0de6a4f](https://github.com/voxpelli/typed-utils/commit/0de6a4fe155e2e84f8178e200305c62793c44ac1))

## [1.8.0](https://github.com/voxpelli/typed-utils/compare/v1.7.0...v1.8.0) (2024-04-15)


### Features

* add `looksLikeAnErrnoException()` ([3168df5](https://github.com/voxpelli/typed-utils/commit/3168df517464de645b6cf11b36a18e8a4f9a93af))


### Bug Fixes

* ensure `@deprecated` is kept in exported type ([ab05a1d](https://github.com/voxpelli/typed-utils/commit/ab05a1dc1ac7bac616dc93e045dd25bd9c29032f))

## [1.7.0](https://github.com/voxpelli/typed-utils/compare/v1.6.0...v1.7.0) (2024-04-03)


### Features

* filterWithCallback() ([87591ab](https://github.com/voxpelli/typed-utils/commit/87591abea0db11141cfc3dc898d3bb74958d6d55))
* rename `isUnknownArray` to `typesafeIsArray` ([b594494](https://github.com/voxpelli/typed-utils/commit/b594494ea3fb4758c03a2e186f562b2b0f784248))

## [1.6.0](https://github.com/voxpelli/typed-utils/compare/v1.5.0...v1.6.0) (2024-03-11)


### Features

* `typedObjectKeys()` / `typedObjectKeysAll()` ([b374c92](https://github.com/voxpelli/typed-utils/commit/b374c9240290da0f4a71aac99695980dfab4e074))

## [1.5.0](https://github.com/voxpelli/typed-utils/compare/v1.4.1...v1.5.0) (2024-03-11)


### Features

* `explainVariable()` ([b89aea8](https://github.com/voxpelli/typed-utils/commit/b89aea8f20d29ca29bac80e87a439f939717602e))

## [1.4.1](https://github.com/voxpelli/typed-utils/compare/v1.4.0...v1.4.1) (2024-03-10)


### Bug Fixes

* actually export pick/omit ([e210d1b](https://github.com/voxpelli/typed-utils/commit/e210d1b0c1a3d380c37f40fb9bfe4af7b51734d5))

## [1.4.0](https://github.com/voxpelli/typed-utils/compare/v1.3.0...v1.4.0) (2024-03-10)


### Features

* release `omit()` and `pick()` ([5690ae3](https://github.com/voxpelli/typed-utils/commit/5690ae378033188a86dfbdfaa1f094dacfffca54))
