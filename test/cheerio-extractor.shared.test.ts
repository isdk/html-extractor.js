// cheerio-extractor.shared.test.ts
import { describe, test, expect } from 'vitest';
import { CheerioHTMLExtractor } from '../src/cheerio-extractor';
import { TestRunner, Extractor } from './extractor-utils';
import { sharedTestCases, advancedTestCases, createPerformanceTestData } from './extractor-shared-tests';
import type { ExtractionRule } from '../src/extractor-types';

// Cheerio 提取器工厂
const createCheerioExtractor = (): Extractor => {
  return new CheerioHTMLExtractor();
};

// 运行基础测试用例
TestRunner.runTests('Cheerio', createCheerioExtractor, sharedTestCases);

// 运行高级测试用例
TestRunner.runTests('Cheerio 高级', createCheerioExtractor, advancedTestCases);

// 运行性能测试
const { largeHTML, complexSchema } = createPerformanceTestData();
TestRunner.runPerformanceTests('Cheerio', createCheerioExtractor, largeHTML, complexSchema);

// 特定于 Cheerio 的测试
describe('Cheerio 特定测试', () => {
  const extractor = new CheerioHTMLExtractor();

  test('应该能正确处理复杂的 CSS 选择器', () => {
    const html = `
      <div>
        <span class="item active">Item 1</span>
        <span class="item">Item 2</span>
        <span class="item active">Item 3</span>
      </div>
    `;
    const schema: ExtractionRule = {
      selector: '.item.active',
      multiple: true,
    };

    const result = extractor.extract(html, schema);
    expect(result).toEqual(['Item 1', 'Item 3']);
  });

  test('transform 函数应该接收到 Cheerio 元素', () => {
    const html = '<a href="/test" class="link">Test Link</a>';
    const schema: ExtractionRule = {
      selector: 'a.link',
      transform: (text, el: any) => {
        // Cheerio 元素有 attr 方法
        return `${text} - ${el.attr('href')}`;
      },
    };

    const result = extractor.extract(html, schema);
    expect(result).toBe('Test Link - /test');
  });
});