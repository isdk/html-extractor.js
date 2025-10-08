import { JSDOM } from 'jsdom';

export function isLikelyTextContent(html: string): boolean {
  try {
    const dom = new JSDOM(html);
    const text = dom.window.document.body.textContent || '';
    const tags = dom.window.document.querySelectorAll('*').length;

    // 简单的启发式：文本密度和绝对长度
    const textDensity = text.length / Math.max(1, tags);
    const hasSubstantialText = text.length > 500;

    return textDensity > 20 && hasSubstantialText;
  } catch {
    return false;
  }
}
