# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.3.0](https://github.com///compare/v0.2.0...v0.3.0) (2026-09-27)

### ⚠ BREAKING CHANGES

* reuse @isdk/mdast-plus for HTML-to-Markdown conversion

### Bug Fixes

* **toReadableMarkdown:** should pass more options to htmlReadabilityPlugin ([0942537](https://github.com///commit/094253788c005415c660d0bd04699cdb6e691c32))
* **toReadableMarkdown:** use htmlReadabilityPlugins so frontmatter gets injected ([c68e49d](https://github.com///commit/c68e49d8a52abb81111b68c9f48199bc7e88b269))
* **ts:** make ts happy ([42b2f06](https://github.com///commit/42b2f06c101ab0d4539020c1667e731e78ac750c))

### Refactor

* add attachMetadata into ReadableHtmlOptions ([7072095](https://github.com///commit/707209582c84632a8ed0e29064300c3e3628764a))
* add ReadableMarkdownOptions better ([86b3a44](https://github.com///commit/86b3a4490072ae8a8d73d3828ae95bc5d9593cf8))
* complete path B — inject article into mdast-plus readability ([4081ca3](https://github.com///commit/4081ca34d6b8c7d3e5e35fdcf3368910fcbc68c2))
* reuse @isdk/mdast-plus for HTML-to-Markdown conversion ([78e89db](https://github.com///commit/78e89db2d3703c5ce961f9384a4bb2a80f58e4ab))
* **toReadableMarkdown:** add attachMetadata option ([12ef2ad](https://github.com///commit/12ef2adc93df91348b0788ecfc19ba4b3440771a))

## [0.2.0](https://github.com///compare/v0.1.1...v0.2.0) (2026-09-09)

### ⚠ BREAKING CHANGES

* extract BaseHTMLExtractor from them

### Features

* extract BaseHTMLExtractor from them ([ebb6cf0](https://github.com///commit/ebb6cf0b4aeb4850f6344abc94c05890ca641a0a))
* handle empty links with configurable markdown brackets ([368d1f4](https://github.com///commit/368d1f45806ed629eca4ee24ecaeac8a1513b1b7))

### Bug Fixes

* **doc:** the return value of extractHtmlContent description ([10d00c2](https://github.com///commit/10d00c227ff8987f6879f25f735e3f4ae48068fb))
* **ts:** import vfile Compatible type ([f0b6d00](https://github.com///commit/f0b6d00f27925f938372035849c300c038779920))
## 0.1.1 (2025-10-09)


### Features

* add ensureBaseUrl ([eca432e](https://github.com/isdk/html-extractor.js/commit/eca432e51eb1c12d53fd97ca8d969f464d3cc452))
* add extractHtmlMetadata ([43b9926](https://github.com/isdk/html-extractor.js/commit/43b9926128b699bbcd0adcd556ae3d21eb3e47be))
* add jsdom-extractor ([3e9cc03](https://github.com/isdk/html-extractor.js/commit/3e9cc03fcb3d6ab5f0db400a9d2d1e316e8126c1))
* **ts:** add interface StructuredOptions ([2129217](https://github.com/isdk/html-extractor.js/commit/2129217bd8f22fe8e2f1e16a577572a8ef3ea8a7))


### Bug Fixes

* html to markdown ([afaf8d5](https://github.com/isdk/html-extractor.js/commit/afaf8d583a42ef807b83378dbfa3b1df5dbf71de))
* no print warn if throw error ([1c7772b](https://github.com/isdk/html-extractor.js/commit/1c7772bfbddc60cf0faa43d48c47fc5695eef4f7))
* transform number/bool ([bda6aa6](https://github.com/isdk/html-extractor.js/commit/bda6aa683b5405b120b7e09435f1f993955e1223))
* ts type ([6d1a891](https://github.com/isdk/html-extractor.js/commit/6d1a891cc8ae15eb32b3c08d101ca72c884c6932))
* **ts:** type ([e3507cc](https://github.com/isdk/html-extractor.js/commit/e3507cc53263859951d3c97e2d0f6aadb3ae8759))
* **ts:** type ([25c3e71](https://github.com/isdk/html-extractor.js/commit/25c3e71c6216bfe32608e49f8d4c198a39e42160))


### Refactor

* add more unlikelyCandidates to Readability ([0287aa5](https://github.com/isdk/html-extractor.js/commit/0287aa589cb024d43f4c12b67993947cb8924d65))
* add optional options arg ([b4d0817](https://github.com/isdk/html-extractor.js/commit/b4d08171704ac78bebc648c885805094f393b927))
* extract types from ([468fd01](https://github.com/isdk/html-extractor.js/commit/468fd01d64fcaa6a171fe38d2479ad0d240d466b))
* minor change ts decl ([b4d5fcf](https://github.com/isdk/html-extractor.js/commit/b4d5fcf5298c44f9ea61fcca85db90e4a1fd9d20))
* minor changes ([0e54c20](https://github.com/isdk/html-extractor.js/commit/0e54c20817782515bcfcc1d28e61cf46818d572f))
* remove unused types.ts ([f2cac17](https://github.com/isdk/html-extractor.js/commit/f2cac1770f8ea66a054f9e5f411bba235dbaaaf2))
* rename extractor-types ([0010a9a](https://github.com/isdk/html-extractor.js/commit/0010a9a4aa9e079986ea780db84c3c5aea5e1000))
* rename filename ([8b2e855](https://github.com/isdk/html-extractor.js/commit/8b2e855655c55e9cb4ef9add9192135a940d1a57))
* rename to hast-extractor ([ac9d010](https://github.com/isdk/html-extractor.js/commit/ac9d0104784c9c867ef5f76db9684bee2accb6fa))
