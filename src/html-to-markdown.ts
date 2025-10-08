// extract from https://github.com/jaywcjlove/html-to-markdown-cli/blob/main/packages/html-to-markdown/src/index.ts
import { unified, PluggableList } from 'unified';
import rehypeParse, { Options as RehypeParseOptions } from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import rehypeIgnore from 'rehype-ignore';
import rehypeFormat from 'rehype-format';
import remarkGfm from 'remark-gfm';
import rehypeVideo from 'rehype-video';
import { type Processor, type Compatible } from 'unified/lib';

export type ToMarkdownOptions = {
  url?: string
  rehypeParseOption?: RehypeParseOptions;
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

// 在 html 中 有一个 `<base>` 标签，用来改变链接的基准路径，eg, `<base href="https://example.com">`
export async function htmlToMarkdown(html?: Compatible, options: ToMarkdownOptions = {}) {
  const { rehypeParseOption, remarkPlugins = [], rehypePlugins = [] } = options;

  const file = await unified()
    .use(rehypeParse, { fragment: true, ...rehypeParseOption })
    .use(rehypeIgnore)
    .use(remarkGfm)
    .use(rehypeVideo)
    .use(rehypeFormat)
    .use(rehypePlugins || [])
    .use(rehypeRemark) // html to markdown
    .use(remarkPlugins || [])
    .use(remarkStringify)
    .process(html);
  return String(file);
}
