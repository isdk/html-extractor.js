// hast-extractor.shared.test.ts
import { describe } from 'vitest'
import { HastHTMLExtractor } from '../src/hast-extractor'
import { TestRunner, Extractor } from './extractor-utils'
import { sharedTestCases, advancedTestCases, createPerformanceTestData } from './extractor-shared-tests'
import type { Schema } from '../src/extractor-types'

// HAST 提取器工厂
const createHastExtractor = (): Extractor => {
  return new HastHTMLExtractor()
}

// 运行基础测试用例
TestRunner.runTests('HAST', createHastExtractor, sharedTestCases)

// 运行高级测试用例
TestRunner.runTests('HAST 高级', createHastExtractor, advancedTestCases)

// 运行性能测试
const { largeHTML, complexSchema } = createPerformanceTestData()
TestRunner.runPerformanceTests('HAST', createHastExtractor, largeHTML, complexSchema)

// 特定于 HAST 的测试
describe('HAST 特定测试', () => {
  const extractor = new HastHTMLExtractor()

  test('应该正确处理驼峰属性名', () => {
    const html = '<div class="test" data-custom-attr="value">content</div>'
    const schema: Schema = {
      type: 'string',
      selector: '.test',
      attribute: 'data-custom-attr'
    }

    const result = extractor.extract(html, schema)
    expect(result).toBe('value')
  })
})
