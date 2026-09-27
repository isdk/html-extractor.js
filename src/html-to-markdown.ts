// Markdown conversion implemented on top of @isdk/mdast-plus.
// Originally extracted from
// https://github.com/jaywcjlove/html-to-markdown-cli/blob/main/packages/html-to-markdown/src/index.ts
// and now refactored to reuse the mdast-plus pipeline (the underlying
// toolkit) instead of maintaining a private unified pipeline here.
import type { Compatible } from 'vfile';
import type { Options as RehypeParseOptions } from 'rehype-parse';
import rehypeVideo from 'rehype-video';
import rehypeIgnore from 'rehype-ignore';
import rehypeFormat from 'rehype-format';

import {
  DefaultEmptyLinkBrackets,
  PipelineStage,
  mdast,
  removeEmptyLinksPlugin,
  type MdastPlugin,
} from '@isdk/mdast-plus';

/**
 * The default delimiters wrapped around the text of an empty link
 * (an `<a>` without `href`, or with `href=""`/`"#"`) when converted to markdown.
 */
export { DefaultEmptyLinkBrackets } from '@isdk/mdast-plus';

export type ToMarkdownOptions = {
  url?: string
  rehypeParseOption?: RehypeParseOptions;
  /**
   * Delimiters to wrap around the text of an empty link (`<a>` without `href`,
   * or with `href=""`/`"#"`) in the markdown output.
   *
   * Default: `['[', ']']` — e.g. `<a>文字</a>` becomes `[文字]`.
   * A link with no text at all is dropped entirely.
   * Pass `false` to keep the previous behavior: emit them as markdown links
   * with an empty destination (`[文字]()`, `[](#)`).
   *
   * Note: links to real in-page anchors (e.g. `href="#section1"`) are not
   * considered empty and are always converted to normal markdown links.
   */
  emptyLinkBrackets?: [string, string] | false;
  /**
   * List of [remark plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins) to use.
   * See the next section for examples on how to pass options
   */
  remarkPlugins?: any[];
  /**
   * List of [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins) to use.
   * See the next section for examples on how to pass options
   */
  rehypePlugins?: any[];
  unified?: unknown;
}

/**
 * Domain (rehype) plugins for the HTML extraction domain: video link
 * recognition, `<!-- html ignore -->` blocks and HTML normalization.
 * They operate on hast so they must run in the parse stage, before
 * `rehype-remark` converts the tree to mdast.
 */
const htmlExtractorRehypePlugins: MdastPlugin[] = [
  { plugin: rehypeIgnore, stage: PipelineStage.parse, before: 'rehype-remark' },
  { plugin: rehypeVideo, stage: PipelineStage.parse, before: 'rehype-remark' },
  { plugin: rehypeFormat, stage: PipelineStage.parse, before: 'rehype-remark' },
];

// 在 html 中 有一个 `<base>` 标签，用来改变链接的基准路径，eg, `<base href="https://example.com">`
export async function htmlToMarkdown(html?: Compatible, options: ToMarkdownOptions = {}) {
  const { rehypeParseOption, remarkPlugins = [], rehypePlugins = [], emptyLinkBrackets = DefaultEmptyLinkBrackets } = options;

  const pipeline = mdast(html).from('html', rehypeParseOption ? { 'rehype-parse': rehypeParseOption } : undefined).use(htmlExtractorRehypePlugins);

  pipeline.useAt(removeEmptyLinksPlugin, { brackets: emptyLinkBrackets });

  if (rehypePlugins?.length) pipeline.use(rehypePlugins);
  if (remarkPlugins?.length) pipeline.useAt(PipelineStage.compile, remarkPlugins);

  return pipeline.toMarkdown();
}
