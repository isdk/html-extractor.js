import { TestCase } from './extractor-utils'
import type { ExtractionRule } from '../src/extractor-types'

export const sharedTestCases: TestCase[] = [
  // 基础选择器测试
  {
    name: '应该使用元素选择器提取文本',
    html: '<div>hello world</div>',
    schema: {
      type: 'string',
      selector: 'div'
    },
    expected: 'hello world'
  },
  {
    name: '应该使用类选择器提取文本',
    html: '<div class="test">hello world</div>',
    schema: {
      type: 'string',
      selector: '.test'
    },
    expected: 'hello world'
  },
  {
    name: '应该使用ID选择器提取文本',
    html: '<div id="main">hello world</div>',
    schema: {
      type: 'string',
      selector: '#main'
    },
    expected: 'hello world'
  },
  {
    name: '应该提取属性值',
    html: '<div data-id="123" class="test">content</div>',
    schema: {
      type: 'string',
      selector: '.test',
      attribute: 'data-id'
    },
    expected: '123'
  },

  // 伪类选择器测试
  {
    name: '应该使用 :first-child 选择器',
    html: `
      <div class="container">
        <p class="item">First</p>
        <p class="item">Second</p>
        <p class="item">Third</p>
      </div>
    `,
    schema: {
      type: 'string',
      selector: '.item:first-child'
    },
    expected: 'First'
  },
  {
    name: '应该使用 :last-child 选择器',
    html: `
      <div class="container">
        <p class="item">First</p>
        <p class="item">Second</p>
        <p class="item">Third</p>
      </div>
    `,
    schema: {
      type: 'string',
      selector: '.item:last-child'
    },
    expected: 'Third'
  },
  {
    name: '应该使用 :nth-child() 选择器',
    html: `
      <div class="container">
        <p class="item">First</p>
        <p class="item">Second</p>
        <p class="item">Third</p>
      </div>
    `,
    schema: {
      type: 'string',
      selector: '.item:nth-child(2)'
    },
    expected: 'Second'
  },

  // 数组提取测试
  {
    name: '应该提取多个元素为数组',
    html: `
      <div class="items">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
      </div>
    `,
    schema: {
      type: 'array',
      selector: '.item',
      items: {
        type: 'string'
      }
    },
    expected: ['Item 1', 'Item 2', 'Item 3']
  },
  {
    name: '应该处理嵌套数组结构',
    html: `
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
    `,
    schema: {
      type: 'array',
      selector: '.article',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', selector: 'h2' },
          tags: {
            type: 'array',
            selector: '.tag',
            items: { type: 'string' }
          }
        }
      }
    },
    expected: [
      {
        title: 'Title 1',
        tags: ['JavaScript', 'HTML']
      },
      {
        title: 'Title 2',
        tags: ['CSS']
      }
    ]
  },

  // 对象提取测试
  {
    name: '应该提取嵌套对象',
    html: `
      <div class="profile">
        <h1 class="name">John Doe</h1>
        <div class="details">
          <span class="age">30</span>
          <span class="city">New York</span>
        </div>
      </div>
    `,
    schema: {
      type: 'object',
      selector: '.profile',
      properties: {
        name: { type: 'string', selector: '.name' },
        details: {
          type: 'object',
          selector: '.details',
          properties: {
            age: { type: 'number', selector: '.age' },
            city: { type: 'string', selector: '.city' }
          }
        }
      }
    },
    expected: {
      name: 'John Doe',
      details: {
        age: 30,
        city: 'New York'
      }
    }
  },

  // 错误处理测试
  {
    name: '应该返回默认值当元素不存在时',
    html: '<div>No target here</div>',
    schema: {
      type: 'string',
      selector: '.nonexistent',
      default: 'default value'
    },
    expected: 'default value'
  },
  {
    name: '应该处理空HTML输入',
    html: '',
    schema: {
      type: 'string',
      selector: 'div',
      default: 'empty'
    },
    expected: 'empty'
  },

  // 复杂选择器测试
  {
    name: '应该使用属性选择器',
    html: `
      <div data-status="active">Active Item</div>
      <div data-status="inactive">Inactive Item</div>
    `,
    schema: {
      type: 'array',
      selector: '[data-status="active"]',
      items: { type: 'string' }
    },
    expected: ['Active Item']
  },
  {
    name: '应该使用组合选择器',
    html: `
      <div class="container">
        <p>Paragraph 1</p>
        <p class="special">Special Paragraph</p>
        <p>Paragraph 2</p>
      </div>
    `,
    schema: {
      type: 'string',
      selector: 'div p.special'
    },
    expected: 'Special Paragraph'
  },

  // 数据类型转换测试
  {
    name: '应该提取数字类型',
    html: '<div class="price">29.99</div>',
    schema: {
      type: 'number',
      selector: '.price'
    },
    expected: 29.99
  },
  {
    name: '应该提取布尔类型',
    html: '<div class="active">true</div>',
    schema: {
      type: 'boolean',
      selector: '.active'
    },
    expected: true
  },
  {
    name: '应该在字符串提取阶段应用转换函数',
    html: '<div class="price">$29.99</div>',
    schema: {
      type: 'string',
      selector: '.price',
      transform: (value: string) => value.replace('$', '')
    },
    expected: '29.99'
  },
  {
    name: '应该在数字提取阶段应用转换函数',
    html: '<div class="price">$29.99</div>',
    schema: {
      type: 'number',
      selector: '.price',
      transform: (value: string) => parseFloat(value.replace('$', ''))
    },
    expected: 29.99
  },
  {
    name: '应该在布尔值提取阶段应用转换函数',
    html: '<div class="status">yes</div>',
    schema: {
      type: 'boolean',
      selector: '.status',
      transform: (value: string) => value === 'yes'
    },
    expected: true
  }
]

// 高级选择器测试用例
export const advancedTestCases: TestCase[] = [
  {
    name: '应该使用 :has() 选择器',
    html: `
      <div class="container">
        <div class="item">Normal Item</div>
        <div class="item">
          <span class="highlight">Highlighted Item</span>
        </div>
      </div>
    `,
    schema: {
      type: 'array',
      selector: '.item:has(.highlight)',
      items: { type: 'string' }
    },
    expected: ['Highlighted Item']
  },
  {
    name: '应该使用 :not() 选择器',
    html: `
      <div class="container">
        <div class="item active">Active Item</div>
        <div class="item">Normal Item</div>
        <div class="item active">Another Active</div>
      </div>
    `,
    schema: {
      type: 'array',
      selector: '.item:not(.active)',
      items: { type: 'string' }
    },
    expected: ['Normal Item']
  }
]

// 性能测试数据
export const createPerformanceTestData = () => {
  const largeHTML = `
    <div class="container">
      ${Array.from({ length: 1000 }, (_, i) => `
        <div class="item" data-id="${i}">
          <h3 class="title">Item ${i}</h3>
          <p class="description">Description for item ${i}</p>
          <span class="price">${(i * 1.5).toFixed(2)}</span>
          <div class="tags">
            <span class="tag">tag${i % 10}</span>
            <span class="tag">tag${(i + 1) % 10}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `

  const complexSchema: ExtractionRule = {
    type: 'object',
    selector: '.container',
    properties: {
      items: {
        type: 'array',
        selector: '.item',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', attribute: 'data-id' },
            title: { type: 'string', selector: '.title' },
            description: { type: 'string', selector: '.description' },
            price: { type: 'number', selector: '.price' },
            tags: {
              type: 'array',
              selector: '.tag',
              items: { type: 'string' }
            }
          }
        }
      },
      stats: {
        type: 'object',
        properties: {
          totalItems: {
            type: 'number',
            selector: '.item',
            multiple: true,
            transform: (items: any[]) => items.length
          },
          averagePrice: {
            type: 'array',
            selector: '.price',
            multiple: true,
            transform: (prices: string[]) => {
              const total = prices.reduce((sum, price) => sum + parseFloat(price), 0)
              return total / prices.length
            }
          }
        }
      }
    }
  }

  return { largeHTML, complexSchema }
}
