# Changelog

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
