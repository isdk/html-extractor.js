// cheerio-extractor.test.ts
import { describe, test, expect, beforeEach } from 'vitest';
import { CheerioHTMLExtractor } from './cheerio-extractor';
import { ExtractionRule } from './extractor-types';

describe('CheerioHTMLExtractor', () => {
  let extractor: CheerioHTMLExtractor;

  beforeEach(() => {
    extractor = new CheerioHTMLExtractor();
  });

  describe('基础选择器测试', () => {
    test('应该使用元素选择器提取文本', () => {
      const html = '<div>hello world</div>';
      const schema: ExtractionRule = {
        type: 'string',
        selector: 'div',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe('hello world');
    });

    test('应该使用类选择器提取文本', () => {
      const html = '<div class="test">hello world</div>';
      const schema: ExtractionRule = {
        type: 'string',
        selector: '.test',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe('hello world');
    });

    test('应该使用ID选择器提取文本', () => {
      const html = '<div id="main">hello world</div>';
      const schema: ExtractionRule = {
        type: 'string',
        selector: '#main',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe('hello world');
    });

    test('应该提取属性值', () => {
      const html = '<div data-id="123" class="test">content</div>';
      const schema: ExtractionRule = {
        type: 'string',
        selector: '.test',
        attribute: 'data-id',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe('123');
    });
  });

  describe('伪类选择器测试', () => {
    test('应该使用 :first-child 选择器', () => {
      const html = `
        <div class="container">
          <p class="item">First</p>
          <p class="item">Second</p>
          <p class="item">Third</p>
        </div>
      `;
      const schema: ExtractionRule = {
        type: 'string',
        selector: '.item:first-child',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe('First');
    });

    test('应该使用 :last-child 选择器', () => {
      const html = `
        <div class="container">
          <p class="item">First</p>
          <p class="item">Second</p>
          <p class="item">Third</p>
        </div>
      `;
      const schema: ExtractionRule = {
        type: 'string',
        selector: '.item:last-child',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe('Third');
    });

    test('应该使用 :nth-child() 选择器', () => {
      const html = `
        <div class="container">
          <p class="item">First</p>
          <p class="item">Second</p>
          <p class="item">Third</p>
        </div>
      `;
      const schema: ExtractionRule = {
        type: 'string',
        selector: '.item:nth-child(2)',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe('Second');
    });

    test('应该使用 :has() 选择器', () => {
      const html = `
        <div class="container">
          <div class="item">Normal Item</div>
          <div class="item">
            <span class="highlight">Highlighted Item</span>
          </div>
        </div>
      `;
      const schema: ExtractionRule = {
        type: 'array',
        selector: '.item:has(.highlight)',
        multiple: true,
        items: { type: 'string' },
      };

      const result = extractor.extract(html, schema);
      expect(result).toEqual(['Highlighted Item']);
    });

    test('应该使用 :not() 选择器', () => {
      const html = `
        <div class="container">
          <div class="item active">Active Item</div>
          <div class="item">Normal Item</div>
          <div class="item active">Another Active</div>
        </div>
      `;
      const schema: ExtractionRule = {
        type: 'array',
        selector: '.item:not(.active)',
        multiple: true,
        items: { type: 'string' },
      };

      const result = extractor.extract(html, schema);
      expect(result).toEqual(['Normal Item']);
    });
  });

  describe('数组提取测试', () => {
    test('应该提取多个元素为数组', () => {
      const html = `
        <div class="items">
          <div class="item">Item 1</div>
          <div class="item">Item 2</div>
          <div class="item">Item 3</div>
        </div>
      `;
      const schema: ExtractionRule = {
        selector: '.item',
        multiple: true,
      };

      const result = extractor.extract(html, schema);
      expect(result).toEqual(['Item 1', 'Item 2', 'Item 3']);
    });

    test('应该处理嵌套数组结构', () => {
      const html = `
        <div class="articles">
          <article class="article">
            <h2>Title 1</h2>
            <p class="tag">JavaScript</p>
            <p class="tag">HTML</p>
          </article>
          <article class="article">
            <h2>Title 2</h2>
            <p class="tag">CSS</p>
          </article>
        </div>
      `;
      const schema: ExtractionRule = {
        type: 'array',
        selector: '.article',
        multiple: true,
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', selector: 'h2' },
            tags: {
              selector: '.tag',
              multiple: true,
            },
          },
        },
      };

      const result = extractor.extract(html, schema);
      expect(result).toEqual([
        {
          title: 'Title 1',
          tags: ['JavaScript', 'HTML'],
        },
        {
          title: 'Title 2',
          tags: ['CSS'],
        },
      ]);
    });
  });

  describe('对象提取测试', () => {
    test('应该提取嵌套对象', () => {
      const html = `
        <div class="profile">
          <h1 class="name">John Doe</h1>
          <div class="details">
            <span class="age">30</span>
            <span class="city">New York</span>
          </div>
        </div>
      `;
      const schema: ExtractionRule = {
        type: 'object',
        selector: '.profile',
        properties: {
          name: { type: 'string', selector: '.name' },
          details: {
            type: 'object',
            selector: '.details',
            properties: {
              age: { type: 'number', selector: '.age' },
              city: { type: 'string', selector: '.city' },
            },
          },
        },
      };

      const result = extractor.extract(html, schema);
      expect(result).toEqual({
        name: 'John Doe',
        details: {
          age: 30,
          city: 'New York',
        },
      });
    });
  });

  describe('错误处理测试', () => {
    test('应该返回默认值当元素不存在时', () => {
      const html = '<div>No target here</div>';
      const schema: ExtractionRule = {
        selector: '.nonexistent',
        default: 'default value',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe('default value');
    });

    test('应该对必需字段抛出错误', () => {
      const html = '<div>No target here</div>';
      const schema: ExtractionRule = {
        selector: '.required-element',
        required: true,
      };

      expect(() => extractor.extract(html, schema)).toThrow();
    });

    test('应该处理空HTML输入', () => {
      const schema: ExtractionRule = {
        selector: 'div',
        default: 'empty',
      };

      const result = extractor.extract('', schema);
      expect(result).toBe('empty');
    });
  });

  describe('复杂选择器测试', () => {
    test('应该使用属性选择器', () => {
      const html = `
        <div data-status="active">Active Item</div>
        <div data-status="inactive">Inactive Item</div>
      `;
      const schema: ExtractionRule = {
        type: 'array',
        selector: '[data-status="active"]',
        multiple: true,
      };

      const result = extractor.extract(html, schema);
      expect(result).toEqual(['Active Item']);
    });

    test('应该使用组合选择器', () => {
      const html = `
        <div class="container">
          <p>Paragraph 1</p>
          <p class="special">Special Paragraph</p>
          <p>Paragraph 2</p>
        </div>
      `;
      const schema: ExtractionRule = {
        type: 'string',
        selector: 'div p.special',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe('Special Paragraph');
    });
  });

  describe('数据类型转换测试', () => {
    test('应该提取数字类型', () => {
      const html = '<div class="price">29.99</div>';
      const schema: ExtractionRule = {
        type: 'number',
        selector: '.price',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe(29.99);
    });

    test('应该提取布尔类型', () => {
      const html = '<div class="active">true</div>';
      const schema: ExtractionRule = {
        type: 'boolean',
        selector: '.active',
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe(true);
    });

    test('应该使用转换函数', () => {
      const html = '<div class="price">$29.99</div>';
      const schema: ExtractionRule = {
        type: 'number',
        selector: '.price',
        transform: (value: string) => parseFloat(value.replace('$', '')),
      };

      const result = extractor.extract(html, schema);
      expect(result).toBe(29.99);
    });
  });
});
