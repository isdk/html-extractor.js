// jsdom-extractor.shared.test.ts
import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { JSDOMHTMLExtractor } from '../src/jsdom-extractor'
import { TestRunner, Extractor } from './extractor-utils'
import { sharedTestCases, advancedTestCases, createPerformanceTestData } from './extractor-shared-tests'
import type { ExtractionRule } from '../src/extractor-types'

// JSDOM 提取器工厂
const createJSDOMExtractor = (): Extractor => {
  return new JSDOMHTMLExtractor()
}

// 运行基础测试用例
TestRunner.runTests('JSDOM', createJSDOMExtractor, sharedTestCases)

// 运行高级测试用例
TestRunner.runTests('JSDOM 高级', createJSDOMExtractor, advancedTestCases)

// 运行性能测试
const { largeHTML, complexSchema } = createPerformanceTestData()
TestRunner.runPerformanceTests('JSDOM', createJSDOMExtractor, largeHTML, complexSchema)

// 特定于 JSDOM 的测试
describe('JSDOM 特定测试', () => {
  let extractor: JSDOMHTMLExtractor

  beforeEach(() => {
    extractor = new JSDOMHTMLExtractor()
  })

  afterEach(() => {
    extractor.destroy()
  })

  test('应该支持完整的 DOM API', () => {
    const html = '<div class="test">content</div>'
    const schema: ExtractionRule = {
      type: 'string',
      selector: '.test'
    }

    const result = extractor.extract(html, schema)
    expect(result).toBe('content')
  })
})
