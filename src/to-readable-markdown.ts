import { htmlToMarkdown } from './html-to-markdown'
import {
  TextContentResult,
  ProcessOptions
} from './types';
import { toReadableHtml } from './to-readable-html';

export async function toReadableMarkdown(
    html: string,
    options: ProcessOptions = {}
): Promise<TextContentResult> {
  try {
    const article = toReadableHtml(html, options)

    if (!article || !article.content) {
      throw new Error('Readability failed to extract content from HTML');
    }

    const markdown = await htmlToMarkdown(article.content);
    article.content = markdown;

    return {
      ...article as any,
      success: true
    };
  } catch (error) {
    return {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
