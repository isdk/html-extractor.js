import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
// import { toDom } from 'hast-util-to-dom';
// import { fromDom } from 'hast-util-from-dom';
// import { fromHtml } from 'hast-util-from-html';
// import { ensureBaseUrl } from './ensure-base-url';

const ReadabilityProto = Readability.prototype as any ;

const negativeNames = [
  'unlikelyCandidates',
  // 'negative', 'extraneous',
]

const newRegexParts = ['|advertisement', '|(^|_)ad[-_]']
negativeNames.forEach(name => {
  const oldReg = ReadabilityProto.REGEXPS[name];
  let src = oldReg.source;
  newRegexParts.forEach(part => {
    if (!src.includes(part)) {
      src += part;
    }
  });
  ReadabilityProto.REGEXPS[name] = new RegExp(src, oldReg.flags);
});

export const DefaultBaseUrl = 'https://unknown-url.unk';

//*
function toJsDOM(html: string, options: {url?: string} = {}) {
  const dom = new JSDOM(html, {
    url: options.url || DefaultBaseUrl,
    pretendToBeVisual: true
  });
  return dom.window.document;
}
//*/

/*
function toJsDOM(html: string, options: {url?: string, fragment?: boolean, document?: Document, namespace?: string} = {}) {
  const jsdom = new JSDOM(undefined,  {
    url: options.url || DefaultBaseUrl,
    pretendToBeVisual: true
  })
  const tree = fromHtml(html, options);
  ensureBaseUrl(tree, options.url || DefaultBaseUrl, options);
  const dom = toDom(tree, {document: jsdom.window.document, ...options});
  // console.log('🚀 ~ file: to-readable-html.ts:28 ~ dom:', JSON.stringify(fromDom(dom), undefined, 2))
  return dom as Document
}
// */
export interface ReadableHtmlResult {
    title: string | null | undefined;
    content: Element | null | undefined;
    textContent: string | null | undefined;
    length: number | null | undefined;
    excerpt: string | null | undefined;
    byline: string | null | undefined;
    dir: string | null | undefined;
    siteName: string | null | undefined;
    lang: string | null | undefined;
    publishedTime: string | null | undefined;
}

export function toReadableHtml(html: string, options: {url?: string, readabilityOptions?: any} = {}) {
  const dom = toJsDOM(html, options);

  const readabilityOptions = {
    // debug: true,
    maxElemsToParse: 100000,
    nbTopCandidates: 5,
    charThreshold: 500,
    ...options.readabilityOptions,
    serializer: (el: any) => el,
  };

  const reader = new Readability(dom, readabilityOptions);
  const article = reader.parse();
  return article as ReadableHtmlResult|null;
}
