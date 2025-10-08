import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export function toReadableHtml(html: string, options: {url?: string, readabilityOptions?: any} = {}) {
  const dom = new JSDOM(html, {
      url: options.url || 'https://unknown-url.unk',
      pretendToBeVisual: true
    });
    const readabilityOptions = {
      debug: false,
      maxElemsToParse: 100000,
      nbTopCandidates: 5,
      charThreshold: 500,
      ...options.readabilityOptions
    };

  const reader = new Readability(dom.window.document, readabilityOptions);
  const article = reader.parse();
  return article;
}
