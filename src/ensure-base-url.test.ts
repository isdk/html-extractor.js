import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ensureBaseUrl } from './ensure-base-url';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';

describe('ensureBaseUrl', () => {
  const baseUrl = 'https://example.com/';

  // Mock console methods to avoid cluttering test output
  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  it('should add base tag to HTML string when no base tag exists', () => {
    const html = `
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <p>Hello World</p>
        </body>
      </html>
    `;

    const result = ensureBaseUrl(html, baseUrl);

    expect(result).toBeDefined();
    expect(result).toContain('<base href="https://example.com/">');
    expect(result).toContain('<title>Test</title>');
  });

  it('should add base tag to HAST tree when no base tag exists', () => {
    const html = `
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <p>Hello World</p>
        </body>
      </html>
    `;
    const tree = fromHtml(html, { fragment: false });

    const result = ensureBaseUrl(tree, baseUrl);

    expect(result).toBeDefined();
    const resultHtml = toHtml(result!);
    expect(resultHtml).toContain('<base href="https://example.com/">');
    expect(resultHtml).toContain('<title>Test</title>');
  });

  it('should return undefined when base tag already exists in HTML string', () => {
    const html = `
      <html>
        <head>
          <base href="https://existing.com/">
          <title>Test</title>
        </head>
        <body>
          <p>Hello World</p>
        </body>
      </html>
    `;

    const result = ensureBaseUrl(html, baseUrl);

    expect(result).toBeUndefined();
  });

  it('should return undefined when base tag already exists in HAST tree', () => {
    const html = `
      <html>
        <head>
          <base href="https://existing.com/">
          <title>Test</title>
        </head>
        <body>
          <p>Hello World</p>
        </body>
      </html>
    `;
    const tree = fromHtml(html, { fragment: false });

    const result = ensureBaseUrl(tree, baseUrl);

    expect(result).toBeUndefined();
  });

  it('should create head element and add base tag when no head exists in HTML string', () => {
    const html = `
      <html>
        <body>
          <p>Hello World</p>
        </body>
      </html>
    `;

    const result = ensureBaseUrl(html, baseUrl);

    expect(result).toBeDefined();
    expect(result).toContain('<head>');
    expect(result).toContain('<base href="https://example.com/">');
  });

  it('should create head element and add base tag when no head exists in HAST tree', () => {
    const html = `
      <html>
        <body>
          <p>Hello World</p>
        </body>
      </html>
    `;
    const tree = fromHtml(html, { fragment: false });

    const result = ensureBaseUrl(tree, baseUrl);

    expect(result).toBeDefined();
    const resultHtml = toHtml(result!);
    expect(resultHtml).toContain('<head>');
    expect(resultHtml).toContain('<base href="https://example.com/">');
  });

  it('should handle HTML without html or head tags', () => {
    const html = `
      <body>
        <p>Hello World</p>
      </body>
    `;

    const result = ensureBaseUrl(html, baseUrl);

    expect(result).toBeDefined();
    // In this case, head should be added at the beginning
    expect(result).toMatch(/<head>.*<\/head>/s);
    expect(result).toContain('<base href="https://example.com/">');
  });

  it('should handle completely empty HTML', () => {
    const html = '';

    const result = ensureBaseUrl(html, baseUrl);

    expect(result).toBeDefined();
    expect(result).toContain('<head>');
    expect(result).toContain('<base href="https://example.com/">');
  });

  it('should preserve existing head content when adding base tag', () => {
    const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Test Page</title>
          <link rel="stylesheet" href="styles.css">
        </head>
        <body>
          <p>Hello World</p>
        </body>
      </html>
    `;

    const result = ensureBaseUrl(html, baseUrl);

    expect(result).toBeDefined();
    const resultHtml = result!;
    expect(resultHtml).toContain('<meta charset="utf-8">');
    expect(resultHtml).toContain('<title>Test Page</title>');
    expect(resultHtml).toContain('<link rel="stylesheet" href="styles.css">');
    expect(resultHtml).toContain('<base href="https://example.com/">');
    // Base should be first element in head
    const headContent = resultHtml.match(/<head>(.*?)<\/head>/s)?.[1];
    expect(headContent).toMatch(/^<base href="https:\/\/example\.com\/">/);
  });

  it('should place base tag as first element in head', () => {
    const html = `
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <p>Hello World</p>
        </body>
      </html>
    `;

    const result = ensureBaseUrl(html, baseUrl);

    expect(result).toBeDefined();
    const headContent = result!.match(/<head>(.*?)<\/head>/s)?.[1];
    expect(headContent).toMatch(/^<base href="https:\/\/example\.com\/">/);
  });
});