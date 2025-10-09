// test-utils.ts
import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import type { ExtractionRule } from '../src/extractor-types'

export interface Extractor {
  extract(html: string, schema: ExtractionRule): any
  destroy?: () => void
}

export interface TestCase {
  name: string
  html: string
  schema: ExtractionRule
  expected: any
  only?: boolean
  skip?: boolean
}

export class TestRunner {
  static runTests(
    extractorName: string,
    extractorFactory: () => Extractor,
    testCases: TestCase[]
  ) {
    describe(`${extractorName} 提取器`, () => {
      let extractor: Extractor

      beforeEach(() => {
        extractor = extractorFactory()
      })

      afterEach(() => {
        if (extractor.destroy) {
          extractor.destroy()
        }
      })

      testCases.forEach(testCase => {
        const testFn = testCase.only ? test.only : testCase.skip ? test.skip : test

        testFn(testCase.name, () => {
          const result = extractor.extract(testCase.html, testCase.schema)
          expect(result).toEqual(testCase.expected)
        })
      })
    })
  }

  static runPerformanceTests(
    extractorName: string,
    extractorFactory: () => Extractor,
    largeHTML: string,
    complexSchema: ExtractionRule
  ) {
    describe(`${extractorName} 性能测试`, () => {
      test('应该能够处理大量数据', () => {
        const extractor = extractorFactory()

        const startTime = performance.now()
        const result = extractor.extract(largeHTML, complexSchema)
        const endTime = performance.now()

        const executionTime = endTime - startTime
        console.log(`${extractorName} 处理耗时: ${executionTime.toFixed(2)}ms`)

        if (extractor.destroy) {
          extractor.destroy()
        }

        expect(result.items).toHaveLength(1000)
        expect(executionTime).toBeLessThan(10000) // 10秒超时
      })
    })
  }
}
