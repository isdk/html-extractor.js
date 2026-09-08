// extract from https://github.com/jaywcjlove/html-to-markdown-cli/blob/main/packages/html-to-markdown/src/index.ts
import { unified, PluggableList } from 'unified';
import rehypeParse, { Options as RehypeParseOptions } from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import rehypeIgnore from 'rehype-ignore';
import rehypeFormat from 'rehype-format';
import remarkGfm from 'remark-gfm';
import rehypeVideo from 'rehype-video';
import { defaultHandlers, type Options as ToMdastOptions } from 'hast-util-to-mdast';
import { type Processor, type Compatible } from 'unified/lib';

/**
 * The default delimiters wrapped around the text of an empty link
 * (an `<a>` without `href`, or with `href=""`/`"#"`) when converted to markdown.
 */
export const DefaultEmptyLinkBrackets: [string, string] = ['[', ']']

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
  remarkPlugins?: PluggableList;
  /**
   * List of [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins) to use.
   * See the next section for examples on how to pass options
   */
  rehypePlugins?: PluggableList;
  unified?: Processor;
}

/**
 * Checks whether an `<a>` element is an "empty" link: no `href` attribute,
 * an empty `href`, or a `href` of `"#"` (a dead placeholder anchor).
 *
 * Links to real in-page anchors (e.g. `"#section1"`) are not empty.
 */
function isEmptyLinkHref(node: { properties?: Record<string, unknown> | null }): boolean {
  const href = node.properties?.href;
  return href == null || href === '' || href === '#';
}

/**
 * Builds a custom `a` handler for rehype-remark that wraps the text of empty
 * links in configurable delimiters (default `[` `]`) instead of emitting a
 * markdown link with an empty destination (`[text]()`), which renders as a
 * broken link. Real links (including `#section` anchors) are delegated to the
 * default handler unchanged.
 */
function createEmptyLinkHandler(brackets: [string, string] | false): ToMdastOptions['handlers'] {
  if (brackets === false) return undefined;
  const [open, close] = brackets;
  return {
    a(state, node) {
      if (!isEmptyLinkHref(node)) {
        return defaultHandlers.a(state, node);
      }
      const children = state.all(node);
      if (!children.length) return []; // no text at all: drop the link
      // The delimiters are emitted as raw html nodes so remark-stringify
      // passes them through unescaped (literal `[` in text would be escaped
      // to `\[`, and plain text delimiters would break GFM link syntax).
      return [
        { type: 'html', value: open },
        ...children,
        { type: 'html', value: close },
      ];
    },
  };
}

// 在 html 中 有一个 `<base>` 标签，用来改变链接的基准路径，eg, `<base href="https://example.com">`
export async function htmlToMarkdown(html?: Compatible, options: ToMarkdownOptions = {}) {
  const { rehypeParseOption, remarkPlugins = [], rehypePlugins = [], emptyLinkBrackets = DefaultEmptyLinkBrackets } = options;

  const file = await unified()
    .use(rehypeParse, { fragment: true, ...rehypeParseOption })
    .use(rehypeIgnore)
    .use(remarkGfm)
    .use(rehypeVideo)
    .use(rehypeFormat)
    .use(rehypePlugins || [])
    .use(rehypeRemark, { handlers: createEmptyLinkHandler(emptyLinkBrackets) }) // html to markdown
    .use(remarkPlugins || [])
    .use(remarkStringify)
    .process(html);
  return String(file);
}
