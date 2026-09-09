[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / EmptyLinksAction

# Type Alias: EmptyLinksAction

> **EmptyLinksAction** = `"keep"` \| `"unwrap"` \| `"remove"`

Defined in: [to-readable-html.ts:120](https://github.com/isdk/html-extractor.js/blob/a6824871f6957cd0d8334373ee57b69eeb0a1dbd/src/to-readable-html.ts#L120)

The action to take on empty links found in the extracted content.

An "empty link" is an `<a>` element whose `href` attribute is missing, empty,
or `"#"` — i.e. a link that leads nowhere (typically a leftover from
script-driven UI, navigation menus or placeholder markup).

- `'unwrap'`: keep the link's inner content (text/children), drop the `<a>` wrapper.
  This mirrors how Readability itself handles `javascript:` links.
- `'remove'`: delete the whole `<a>` element including its content.
- `'keep'`: leave empty links untouched (default). They survive into the
  markdown conversion, where `htmlToMarkdown` wraps their text in
  configurable delimiters (default `[文字]`) instead of emitting broken
  `[文字]()` links.
