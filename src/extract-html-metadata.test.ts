// src/__tests__/extractHtmlMetadata.test.ts
import { describe, it, expect } from 'vitest';
import { extractHtmlMetadata } from './extract-html-metadata';

describe('extractHtmlMetadata', () => {
  describe('基础功能测试', () => {
    it('应该能从简单的HTML中提取标题', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面标题</title>
        </head>
        <body>
          <h1>页面内容</h1>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.title).toBe('测试页面标题');
    });

    it('应该能从h1标签中提取标题', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
        </head>
        <body>
          <h1>页面主标题</h1>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html, {useH1AsTitleFallback: true});
      expect(metadata.title).toBe('页面主标题');
    });

    it('应该能提取语言和方向属性', () => {
      const html = `
        <!DOCTYPE html>
        <html lang="zh-CN" dir="ltr">
        <head>
          <title>测试页面</title>
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.lang).toBe('zh-CN');
      expect(metadata.dir).toBe('ltr');
    });

    it('应该能提取base URL', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <base href="https://example.com/path/">
          <title>测试页面</title>
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.baseUrl).toBe('https://example.com/path/');
    });
  });

  describe('Meta标签测试', () => {
    it('应该能提取标准meta标签', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <meta name="author" content="张三">
          <meta name="description" content="页面描述内容">
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.byline).toBe('张三');
      expect(metadata.excerpt).toBe('页面描述内容');
    });

    it('应该能提取Open Graph meta标签', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <meta property="og:title" content="OG标题">
          <meta property="og:description" content="OG描述">
          <meta property="og:site_name" content="站点名称">
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.title).toBe('OG标题');
      expect(metadata.excerpt).toBe('OG描述');
      expect(metadata.siteName).toBe('站点名称');
    });

    it('应该能提取Article meta标签', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <meta property="article:published_time" content="2023-01-01T12:00:00Z">
          <meta property="article:author" content="文章作者">
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.publishedTime).toBe('2023-01-01T12:00:00Z');
      expect(metadata.byline).toBe('文章作者');
    });

    it('应该能提取Parsely meta标签', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <meta name="parsely-pub-date" content="2023-01-01T12:00:00Z">
          <meta name="parsely-author" content="Parsely作者">
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.publishedTime).toBe('2023-01-01T12:00:00Z');
      expect(metadata.byline).toBe('Parsely作者');
    });
  });

  describe('JSON-LD测试', () => {
    it('应该能提取基本的JSON-LD数据', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "JSON-LD标题",
            "description": "JSON-LD描述",
            "author": {
              "@type": "Person",
              "name": "JSON-LD作者"
            },
            "datePublished": "2023-01-01T12:00:00Z",
            "publisher": {
              "@type": "Organization",
              "name": "发布机构"
            }
          }
          </script>
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.title).toBe('JSON-LD标题');
      expect(metadata.excerpt).toBe('JSON-LD描述');
      expect(metadata.byline).toBe('JSON-LD作者');
      expect(metadata.datePublished).toBe('2023-01-01T12:00:00Z');
      expect(metadata.siteName).toBe('发布机构');
    });

    it('应该能处理数组形式的作者信息', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "多作者文章",
            "author": [
              {
                "@type": "Person",
                "name": "作者1"
              },
              {
                "@type": "Person",
                "name": "作者2"
              }
            ]
          }
          </script>
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.byline).toBe('作者1, 作者2');
    });

    it('应该能处理@graph结构的JSON-LD', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                "headline": "Graph标题",
                "author": "Graph作者",
                "datePublished": "2023-01-01T12:00:00Z"
              }
            ]
          }
          </script>
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.title).toBe('Graph标题');
      expect(metadata.byline).toBe('Graph作者');
      expect(metadata.datePublished).toBe('2023-01-01T12:00:00Z');
    });

    it('应该能处理多个JSON-LD块并选择正确的类型', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "网站名称"
          }
          </script>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": "新闻标题",
            "author": "新闻作者"
          }
          </script>
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.title).toBe('新闻标题');
      expect(metadata.byline).toBe('新闻作者');
    });

   it('应该能处理包含CDATA的JSON-LD数据', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <script type="application/ld+json">
            <![CDATA[
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "CDATA标题",
              "author": "CDATA作者",
              "datePublished": "2023-01-01T12:00:00Z"
            }
            ]]>
          </script>
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.title).toBe('CDATA标题');
      expect(metadata.byline).toBe('CDATA作者');
      expect(metadata.datePublished).toBe('2023-01-01T12:00:00Z');
    });

    it('应该能处理包含CDATA和其他内容的JSON-LD数据', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <script type="application/ld+json">
            // 这是一些注释
            <![CDATA[
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "复杂CDATA标题",
              "description": "复杂CDATA描述"
            }
            ]]>
            // 更多注释
          </script>
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.title).toBe('复杂CDATA标题');
      expect(metadata.excerpt).toBe('复杂CDATA描述');
    });
  });

  describe('优先级测试', () => {
    it('应该正确处理标题提取的优先级', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>HTML标题</title>
          <meta property="og:title" content="OG标题">
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "JSON-LD标题"
          }
          </script>
        </head>
        <body>
          <h1>页面H1标题</h1>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      // JSON-LD 标题应该优先于其他来源
      expect(metadata.title).toBe('JSON-LD标题');
    });

    it('应该在没有JSON-LD时使用OG数据', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>HTML标题</title>
          <meta property="og:title" content="OG标题">
        </head>
        <body>
          <h1>页面H1标题</h1>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      // OG 标题应该优先于HTML标题和H1
      expect(metadata.title).toBe('OG标题');
    });
  });

  describe('复杂场景测试', () => {
    it('应该能处理包含HTML实体的元数据', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>HTML标题</title>
          <meta property="og:title" content="标题包含&quot;引号&quot;和&amp;符号">
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.title).toBe('标题包含"引号"和&符号');
    });

    it('应该能处理不规范的JSON-LD', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Article"
            // 故意缺少逗号的不规范JSON
            "headline": "不规范JSON标题"
          }
          </script>
        </head>
        <body>
        </body>
        </html>
      `;

      // 应该不会抛出异常，但也不会提取到JSON-LD数据
      expect(() => {
        const metadata = extractHtmlMetadata(html);
        // 会回退到其他来源
        expect(metadata.title).toBe('测试页面');
      }).not.toThrow();
    });

    it('应该能处理多个meta标签具有相同属性名的情况', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>测试页面</title>
          <meta property="og:title" content="第一个OG标题">
          <meta property="og:title" content="第二个OG标题">
        </head>
        <body>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      // 应该获取到最后一个值
      expect(metadata.title).toBe('第二个OG标题');
    });
  });

  describe('真实网站示例测试', () => {
    it('应该能处理类似新闻网站的结构', () => {
      const html = `
        <!DOCTYPE html>
        <html lang="zh-CN" dir="ltr">
        <head>
          <meta charset="utf-8">
          <base href="https://news.example.com/">
          <title>新闻标题 - 新闻网站</title>
          <meta name="description" content="新闻描述内容">
          <meta property="og:title" content="新闻标题">
          <meta property="og:description" content="新闻描述内容">
          <meta property="og:site_name" content="新闻网站">
          <meta property="article:published_time" content="2023-06-15T09:30:00+08:00">
          <meta property="article:author" content="记者张三">
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": "新闻标题",
            "description": "新闻描述内容",
            "datePublished": "2023-06-15T09:30:00+08:00",
            "author": {
              "@type": "Person",
              "name": "记者张三"
            },
            "publisher": {
              "@type": "Organization",
              "name": "新闻网站"
            }
          }
          </script>
        </head>
        <body>
          <article>
            <h1>新闻标题</h1>
            <p>新闻内容...</p>
          </article>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.title).toBe('新闻标题');
      expect(metadata.excerpt).toBe('新闻描述内容');
      expect(metadata.byline).toBe('记者张三');
      expect(metadata.siteName).toBe('新闻网站');
      expect(metadata.publishedTime).toBe('2023-06-15T09:30:00+08:00');
      expect(metadata.lang).toBe('zh-CN');
      expect(metadata.dir).toBe('ltr');
      expect(metadata.baseUrl).toBe('https://news.example.com/');
    });

    it('应该能处理博客网站的结构', () => {
      const html = `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        <head>
          <title>博客文章标题</title>
          <meta name="author" content="博客作者">
          <meta name="description" content="博客文章摘要">
          <meta property="og:title" content="博客文章标题">
          <meta property="og:type" content="article">
          <meta property="article:published_time" content="2023-06-01T10:00:00Z">
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": "博客文章标题",
            "description": "博客文章摘要",
            "datePublished": "2023-06-01T10:00:00Z",
            "author": {
              "@type": "Person",
              "name": "博客作者"
            }
          }
          </script>
        </head>
        <body>
          <article>
            <header>
              <h1>博客文章标题</h1>
            </header>
            <div class="content">
              <p>文章内容...</p>
            </div>
          </article>
        </body>
        </html>
      `;

      const metadata = extractHtmlMetadata(html);
      expect(metadata.title).toBe('博客文章标题');
      expect(metadata.excerpt).toBe('博客文章摘要');
      expect(metadata.byline).toBe('博客作者');
      expect(metadata.publishedTime).toBe('2023-06-01T10:00:00Z');
      expect(metadata.lang).toBe('en');
      expect(metadata.dir).toBe('ltr');
    });
  });
});