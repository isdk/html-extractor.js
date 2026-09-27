[**@isdk/html-extractor**](../README.md)

***

[@isdk/html-extractor](../globals.md) / toReadableMarkdown

# Function: toReadableMarkdown()

> **toReadableMarkdown**(`html`, `options?`): `Promise`\<[`TextContentResult`](../interfaces/TextContentResult.md)\>

Defined in: [html-extractor/src/to-readable-markdown.ts:62](https://github.com/isdk/html-extractor.js/blob/c68e49d8a52abb81111b68c9f48199bc7e88b269/src/to-readable-markdown.ts#L62)

Converts HTML content to readable markdown format.

The article is extracted exactly once: `toReadableHtml` runs Readability
and applies DOM-level cleanups (comments, empty links), then hands the
result to `@isdk/mdast-plus` via the readability plugin's `article`
injection hook. The mdast-plus pipeline performs the hast conversion,
empty-link cleanup and markdown serialization — this package only
contributes its domain enhancements (see `htmlExtractorRehypePlugins`)
on top.

## Parameters

### html

`string`

The HTML string to convert to readable markdown

### options?

[`ReadableMarkdownOptions`](../interfaces/ReadableMarkdownOptions.md) = `{}`

Configuration options for HTML readability processing (optional)

## Returns

`Promise`\<[`TextContentResult`](../interfaces/TextContentResult.md)\>

A promise that resolves to a TextContentResult containing the processed content
         and metadata, with success flag indicating operation outcome

## Remarks

The cleaned DOM subtree is serialized to an HTML string before injection:
it lives in the extraction JSDOM, while the conversion pipeline parses its
input in a separate JSDOM. Passing the live `Element` instead would make
the conversion consume the *uncleaned* input, silently dropping the
`emptyLinks`/`removeComments` cleanups.
