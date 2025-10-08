import { HastHTMLExtractor } from './extractor'
import type { Schema } from './extractor-types'

describe('HastHTMLExtractor', () => {
  let extractor: HastHTMLExtractor

  beforeEach(() => {
    extractor = new HastHTMLExtractor()
  })

  describe('基础选择器测试', () => {
    test('应该使用元素选择器提取文本', () => {
      const html = '<div>hello world</div>'
      const schema: Schema = {
        type: 'string',
        selector: 'div'
      }

      const result = extractor.extract(html, schema)
      expect(result).toBe('hello world')
    })

    test('应该使用类选择器提取文本', () => {
      const html = '<div class="test">hello world</div>'
      const schema: Schema = {
        type: 'string',
        selector: '.test'
      }

      const result = extractor.extract(html, schema)
      expect(result).toBe('hello world')
    })

    test('应该使用ID选择器提取文本', () => {
      const html = '<div id="main">hello world</div>'
      const schema: Schema = {
        type: 'string',
        selector: '#main'
      }

      const result = extractor.extract(html, schema)
      expect(result).toBe('hello world')
    })

    test('应该提取属性值', () => {
      const attribute = 'Data-iDAs1'
      const html = `<div ${attribute}="123" class="test">content</div>`
      const schema: Schema = {
        type: 'string',
        selector:
         '.test',
        attribute
      }

      const result = extractor.extract(html, schema)
      expect(result).toBe('123')
    })
  })

  describe('伪类选择器测试', () => {
    test('应该使用 :first-child 选择器', () => {
      const html = `
        <div class="container">
          <p class="item">First</p>
          <p class="item">Second</p>
          <p class="item">Third</p>
        </div>
      `
      const schema: Schema = {
        type: 'string',
        selector: '.item:first-child'
      }

      const result = extractor.extract(html, schema)
      expect(result).toBe('First')
    })

    test('应该使用 :last-child 选择器', () => {
      const html = `
        <div class="container">
          <p class="item">First</p>
          <p class="item">Second</p>
          <p class="item">Third</p>
        </div>
      `
      const schema: Schema = {
        type: 'string',
        selector: '.item:last-child'
      }

      const result = extractor.extract(html, schema)
      expect(result).toBe('Third')
    })

    test('应该使用 :nth-child() 选择器', () => {
      const html = `
        <div class="container">
          <p class="item">First</p>
          <p class="item">Second</p>
          <p class="item">Third</p>
        </div>
      `
      const schema: Schema = {
        type: 'string',
        selector: '.item:nth-child(2)'
      }

      const result = extractor.extract(html, schema)
      expect(result).toBe('Second')
    })
  })

  test('should extract using :nth-child selector', () => {
    const html = `
      <div class="items">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
      </div>
    `

    const schema: Schema = {
      type: 'object',
      properties: {
        secondItem: {
          type: 'string',
          selector: '.item:nth-child(2)'
        }
      }
    }

    let result: any = extractor.extract(html, schema)
    expect(result.secondItem).toBe('Item 2')

    result = extractor.extract(html, {type: 'object'})
    expect(result).toMatchObject({
      text: 'Item 1\n        Item 2\n        Item 3',
      html,
      attributes: undefined,
    })
  })

  test('should extract using :has selector', () => {
    const html = `
      <div class="container">
        <div class="item"><span class="special">Special</span></div>
        <div class="item">Normal</div>
      </div>
    `

    const schema: Schema = {
      type: 'object',
      properties: {
        specialItems: {
          type: 'array',
          selector: '.item:has(.special)',
          items: { type: 'string' }
        }
      }
    }

    const result = extractor.extract(html, schema)
    expect(result.specialItems).toEqual(['Special'])
  })

  test('should extract using attribute selectors', () => {
    const html = `
      <div data-status="active">Active</div>
      <div data-status="inactive">Inactive</div>
    `

    const schema: Schema = {
      type: 'object',
      properties: {
        activeItems: {
          type: 'array',
          selector: '[data-status="active"]',
          items: { type: 'string' }
        }
      }
    }

    const result = extractor.extract(html, schema)
    expect(result.activeItems).toEqual(['Active'])
  })
})
