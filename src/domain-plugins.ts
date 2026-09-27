import rehypeVideo from 'rehype-video';
import rehypeIgnore from 'rehype-ignore';
import rehypeFormat from 'rehype-format';
import type { MdastPlugin } from '@isdk/mdast-plus';

/**
 * Domain (rehype) plugins for the HTML extraction domain, shared by
 * `htmlToMarkdown` and `toReadableMarkdown`.
 *
 * - `rehype-ignore`: honors `<!-- html ignore:start -->` / `:end -->`
 *   comment blocks.
 * - `rehype-video`: recognizes video links (mp4 / Bilibili / YouTube)
 *   and converts them to `<video>` elements.
 * - `rehype-format`: normalizes whitespace in the HTML tree.
 *
 * They operate on hast so they must run in the parse stage, before
 * `rehype-remark` converts the tree to mdast.
 */
export const htmlExtractorRehypePlugins: MdastPlugin[] = [
  { plugin: rehypeIgnore, stage: 0, before: 'rehype-remark' },
  { plugin: rehypeVideo, stage: 0, before: 'rehype-remark' },
  { plugin: rehypeFormat, stage: 0, before: 'rehype-remark' },
];
