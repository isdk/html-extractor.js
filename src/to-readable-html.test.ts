// src/to-readable-html.test.ts
import { describe, it, expect } from 'vitest';
import { DefaultBaseUrl, toReadableHtml } from './to-readable-html';

describe('toReadableHtml', () => {
  const sampleArticleHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Test Article</title>
      </head>
      <body>
        <div class="header">
          <h1>Site Header</h1>
          <nav>Navigation links...</nav>
        </div>

        <article>
          <h1>Main Article Title</h1>
          <p class="byline">By Test Author</p>

          <p>This is the first paragraph of the article with meaningful content.</p>

          <p>This is the second paragraph which continues the story and provides more details.</p>

          <div class="advertisement">
            <p>This is an advertisement and should not be included in the main content.</p>
          </div>

          <p>This is the final paragraph of the article with concluding thoughts.</p>
        </article>

        <aside>
          <h2>Related Articles</h2>
          <ul>
            <li>Related article 1</li>
            <li>Related article 2</li>
          </ul>
        </aside>

        <footer>
          <p>Copyright Information</p>
        </footer>
      </body>
    </html>
  `;

  const minimalHtml = `
    <html>
      <body>
        <p>This is a simple paragraph without much structure.</p>
      </body>
    </html>
  `;

  const emptyHtml = '';

  it('should extract readable content from a full HTML document', () => {
    // 当要求文章字数过多，就会把广告等移除的内容也加上
    const result = toReadableHtml(sampleArticleHtml, { url: 'https://example.com/article', readabilityOptions: { charThreshold: 50 } });

    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    expect(result!.title).toBe('Test Article');
    expect(result!.textContent).toContain('This is the first paragraph');
    expect(result!.textContent).toContain('This is the second paragraph');
    expect(result!.textContent).toContain('This is the final paragraph');
    // Should not contain advertisement content
    expect(result!.textContent).not.toContain('advertisement');
  });

  it('should handle minimal HTML input', () => {
    const result = toReadableHtml(minimalHtml);

    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    // With minimal content, readability might use the document title or fallback
    expect(result!.textContent).toContain('This is a simple paragraph');
  });

  it('should handle empty HTML input', () => {
    const result = toReadableHtml(emptyHtml);

    // Readability should still produce a result even with empty input
    expect(result).toBeDefined();
    // Depending on how Readability handles this case, it may be null or have minimal content
  });

  it('should respect custom readability options', () => {
    // Using a very high charThreshold to force exclusion of short content
    const result = toReadableHtml(minimalHtml, {
      readabilityOptions: {
        charThreshold: 1000
      }
    });

    // With high threshold, content might be considered too short
    expect(result).toBeDefined();
  });

  it('should work with URL parameter', () => {
    const testUrl = 'https://test.example.com/page';
    const result = toReadableHtml(minimalHtml, { url: testUrl });

    expect(result).toBeDefined();
    expect(result).not.toBeNull();
  });

  it('should extract content from HTML without body tags', () => {
    const fragmentHtml = '<h1>Title</h1><p>Paragraph content here.</p>';
    const result = toReadableHtml(fragmentHtml);

    expect(result).toBeDefined();
    expect(result).not.toBeNull();
    if (result) {
      expect(result.textContent).toContain('Title');
      expect(result.textContent).toContain('Paragraph content');
    }
  });

  describe('Complex HTML with AD', ()=>{
    // 包含广告和导航栏的完整网页示例
    const htmlWithADAndNavigation = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>科技新闻 - 首页</title>
          <meta property="article:published_time" content="2023-06-15T14:30:00+08:00" />
        </head>
        <body>
          <!-- 顶部导航栏 -->
          <nav class="navbar">
            <div class="nav-brand">
              <a href="/">科技新闻</a>
            </div>
            <ul class="nav-menu">
              <li><a href="/news">新闻</a></li>
              <li><a href="/reviews">评测</a></li>
              <li><a href="/videos">视频</a></li>
              <li><a href="/contact">联系</a></li>
            </ul>
            <div class="nav-search">
              <input type="text" placeholder="搜索...">
            </div>
          </nav>

          <!-- 页面主要内容 -->
          <main class="main-content">
            <article class="news-article">
              <header>
                <h1>人工智能在医疗领域的突破性进展</h1>
                <div class="article-meta">
                  <span class="author">作者：张三</span>
                  <span class="date">2023-06-15</span>
                </div>
              </header>

              <p>近日，人工智能技术在医疗诊断领域取得了重大突破。研究人员开发出一种新型AI系统，能够以超过95%的准确率诊断多种疾病。</p>

              <p>该系统基于深度学习算法，通过分析数百万份医疗影像和病历数据进行训练。在临床试验中，它在肺癌、乳腺癌和皮肤癌的早期检测方面表现尤为突出。</p>

              <!-- 页面内广告 -->
              <div class="ad-container">
                <div class="ad-content">
                  <span>广告</span>
                  <p>【推广】最新智能手机，限时优惠！点击了解更多</p>
                  <button>立即购买</button>
                </div>
              </div>

              <p>专家表示，这项技术有望显著提高诊断效率，减轻医生工作负担，并为偏远地区提供高质量的医疗服务。</p>

              <p>目前，该系统已在三家大型医院进行试点应用，预计明年将推广至全国范围内的医疗机构。</p>

              <blockquote>
                <p>"这是医疗行业的一次革命性变革，"项目首席研究员李博士表示，"AI技术将帮助我们拯救更多生命。"</p>
              </blockquote>

              <p>据报告，使用该AI系统的医院在诊断时间上平均缩短了40%，误诊率下降了35%。</p>
            </article>

            <!-- 侧边栏广告 -->
            <aside class="sidebar">
              <div class="ad-unit">
                <h3>赞助商广告</h3>
                <p>保险产品推荐，保障您的健康生活</p>
                <a href="#">了解更多</a>
              </div>

              <div class="ad-unit">
                <h3>相关文章</h3>
                <ul>
                  <li><a href="#">机器学习基础教程</a></li>
                  <li><a href="#">医疗科技发展趋势</a></li>
                  <li><a href="#">数据隐私保护指南</a></li>
                </ul>
              </div>
            </aside>
          </main>

          <!-- 页脚导航 -->
          <footer class="page-footer">
            <div class="footer-links">
              <ul>
                <li><a href="/about">关于我们</a></li>
                <li><a href="/privacy">隐私政策</a></li>
                <li><a href="/terms">服务条款</a></li>
                <li><a href="/contact">联系我们</a></li>
              </ul>
            </div>
            <div class="copyright">
              <p>&copy; 2023 科技新闻. 保留所有权利.</p>
            </div>
          </footer>

          <!-- 底部悬浮广告 -->
          <div class="floating-ad">
            <div class="ad-close">X</div>
            <p>特别优惠：年度订阅仅需99元！</p>
          </div>
        </body>
      </html>
    `;

    it('should extract main content while filtering out ads and navigation elements', () => {
      const result = toReadableHtml(htmlWithADAndNavigation, {
        url: 'https://technews.example.com/ai-medical-breakthrough',
        readabilityOptions: {
          charThreshold: 100,
        }
      });

      // 验证结果存在
      expect(result).toBeDefined();
      expect(result).not.toBeNull();

      if (result) {
        // console.log('🚀 ~ file: to-readable-html.test.ts:233 ~ result:', result.content?.outerHTML)
        // 验证标题正确提取
        expect(result.title).toBe('科技新闻 - 首页');

        // 验证主要内容包含关键信息
        expect(result.textContent).toContain('人工智能技术在医疗诊断领域取得了重大突破');
        expect(result.textContent).toContain('深度学习算法');
        expect(result.textContent).toContain('临床试验中');
        expect(result.textContent).toContain('医疗行业的一次革命性变革');

        // 验证广告内容被过滤掉
        expect(result.textContent).not.toContain('最新智能手机，限时优惠');
        expect(result.textContent).not.toContain('保险产品推荐');
        expect(result.textContent).not.toContain('年度订阅仅需99元');

        // 验证导航内容被过滤掉
        expect(result.textContent).not.toContain('新闻 评测 视频 联系');
        expect(result.textContent).not.toContain('关于我们 隐私政策 服务条款');
        expect(result.textContent).not.toContain('搜索...');

        // 验证包含作者和日期信息
        expect(result.byline).toContain('作者：张三');
        expect(result.publishedTime).toBe('2023-06-15T14:30:00+08:00')
        // readability 它会尝试从文章内容中提取一个句子作为摘要，因此包含了日期。这里的日期不是标准格式。标准格式是 `article:published_time` or `parsely-pub-date`
        expect(result.excerpt).toContain('2023-06-15');
        expect(result.textContent).toContain('2023-06-15');

        // 验证包含引用内容
        expect(result.textContent).toContain('医疗行业的一次革命性变革');
      }
    });

    it('should preserve semantic structure in extracted content', () => {
      const result = toReadableHtml(htmlWithADAndNavigation);

      expect(result).toBeDefined();
      expect(result).not.toBeNull();

      if (result) {
        // 验证内容有合理的长度，表明提取了实质性内容
        expect(result.textContent?.length).toBeGreaterThan(200);

        // 验证包含多个段落内容
        const paragraphCount = (result.textContent?.match(/人工智能技术在医疗/g) || []).length;
        expect(paragraphCount).toBeGreaterThan(0);

        // 验证包含引用内容
        expect(result.textContent).toContain('医疗行业的一次革命性变革');
      }
    });

    it('should handle complex layout with multiple ads and navigation sections', () => {
      // 使用上面定义的HTML，它本身就包含了复杂的布局
      const result = toReadableHtml(htmlWithADAndNavigation);

      expect(result).toBeDefined();
      expect(result).not.toBeNull();

      if (result) {
        // 验证主要内容被提取
        expect(result.textContent).toContain('人工智能');
        expect(result.textContent).toContain('医疗诊断');

        // 验证页面有明确的标题
        expect(result.title).toBeTruthy();
        expect(result.title).not.toBe('');
      }
    });
  });

  describe('empty links', () => {
    const htmlWithEmptyLinks = `
      <!DOCTYPE html>
      <html>
        <head><title>空链接测试</title></head>
        <body>
          <article>
            <h1>文章标题</h1>
            <p>第一段包含一个<a href="#">死链</a>和一个<a href="">空链接</a>。</p>
            <p>第二段包含一个<a>没有href的链接</a>。</p>
            <p>第三段包含一个<a href="#section1">页内锚点</a>和一个<a href="/about">正常链接</a>。</p>
            <p>第四段包含一个<a href="#">只读不点</a>。</p>
            <p>第五段包含一个纯空<a></a>。</p>
          </article>
        </body>
      </html>
    `;

    it('should keep empty links by default so they reach the markdown layer', () => {
      const result = toReadableHtml(htmlWithEmptyLinks, { url: 'https://example.com/page' });

      expect(result).toBeDefined();
      expect(result).not.toBeNull();

      const innerHTML = result!.content?.innerHTML || '';
      // Empty links are kept by default: the markdown layer wraps their text in brackets
      expect(innerHTML).toContain('<a href="#">死链</a>');
      expect(innerHTML).toContain('<a href="">空链接</a>');
      expect(innerHTML).toContain('<a>没有href的链接</a>');
      // Real links are kept
      expect(innerHTML).toContain('<a href="https://example.com/about">正常链接</a>');
      // In-page anchors with a real target are kept
      expect(innerHTML).toContain('<a href="#section1">页内锚点</a>');
    });

    it('should unwrap empty links when emptyLinks is "unwrap", keeping their text', () => {
      const result = toReadableHtml(htmlWithEmptyLinks, { url: 'https://example.com/page', emptyLinks: 'unwrap' });

      expect(result).toBeDefined();
      expect(result).not.toBeNull();

      const innerHTML = result!.content?.innerHTML || '';
      // Empty links are unwrapped: text kept, no <a> wrapper
      expect(innerHTML).toContain('死链');
      expect(innerHTML).toContain('空链接');
      expect(innerHTML).toContain('没有href的链接');
      expect(innerHTML).not.toContain('<a href="#">死链</a>');
      expect(innerHTML).not.toContain('<a href="">空链接</a>');
      expect(innerHTML).not.toContain('<a>没有href的链接</a>');
    });

    it('should remove empty links entirely when emptyLinks is "remove"', () => {
      const result = toReadableHtml(htmlWithEmptyLinks, {
        url: 'https://example.com/page',
        emptyLinks: 'remove',
      });

      expect(result).toBeDefined();
      expect(result).not.toBeNull();

      const innerHTML = result!.content?.innerHTML || '';
      expect(innerHTML).not.toContain('死链');
      expect(innerHTML).not.toContain('空链接');
      expect(innerHTML).not.toContain('没有href的链接');
      expect(innerHTML).not.toContain('只读不点');
      // Real links are kept
      expect(innerHTML).toContain('正常链接');
      expect(innerHTML).toContain('页内锚点');
    });

    it('should keep empty links when emptyLinks is "keep"', () => {
      const result = toReadableHtml(htmlWithEmptyLinks, {
        url: 'https://example.com/page',
        emptyLinks: 'keep',
      });

      expect(result).toBeDefined();
      expect(result).not.toBeNull();

      const innerHTML = result!.content?.innerHTML || '';
      expect(innerHTML).toContain('<a href="#">死链</a>');
      expect(innerHTML).toContain('<a href="">空链接</a>');
      expect(innerHTML).toContain('<a>没有href的链接</a>');
    });

    it('should filter comments and empty links in a single pass', () => {
      const htmlWithCommentsAndLinks = `
        <article>
          <!-- a comment -->
          <p>段落内容<a href="#">死链</a><!-- another comment --></p>
        </article>
      `;
      const result = toReadableHtml(htmlWithCommentsAndLinks, { emptyLinks: 'unwrap' });

      expect(result).toBeDefined();
      expect(result).not.toBeNull();

      const innerHTML = result!.content?.innerHTML || '';
      expect(innerHTML).not.toContain('<!--');
      expect(innerHTML).toContain('死链');
      expect(innerHTML).not.toContain('<a href="#">死链</a>');
    });
  });

  describe('relative URLs', ()=>{
    // 添加一个包含相对链接的测试用例
    const htmlWithRelativeLinks = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>测试相对链接处理</title>
        </head>
        <body>
          <article>
            <h1>文章标题</h1>
            <p>这是文章的第一段内容，包含一个<a href="/about">相对链接</a>。</p>
            <p>第二段内容有一个图片:<img src="../images/sample.jpg" alt="示例图片">。</p>
            <p>还有一个指向外部资源的<a href="https://external.com">绝对链接</a>。</p>
            <p>最后一个段落包含一个锚点链接<a href="#section1">跳转到第一节</a>。</p>
          </article>
        </body>
      </html>
    `;

    it('should handle relative URLs with baseUrl option', () => {
      const baseUrl = 'https://example.com/articles/2023/';
      const result = toReadableHtml(htmlWithRelativeLinks, { url: baseUrl });

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      // console.log('🚀 ~ file: to-readable-html.test.ts:326 ~ result:', result.content?.outerHTML)

      if (result) {
        // 验证标题正确提取
        expect(result.title).toBe('测试相对链接处理');
        const innerHTML = result.content?.innerHTML;

        // 验证链接
        expect(innerHTML).toContain('包含一个<a href="https://example.com/about">相对链接');
        expect(innerHTML).toContain('有一个图片:<img src="https://example.com/articles/images/sample.jpg"');
        expect(innerHTML).toContain('指向外部资源的<a href="https://external.com/">绝对链接');
      }
    });

    it('should work with different baseUrls', () => {
      const result1 = toReadableHtml(htmlWithRelativeLinks, {
        url: 'https://site1.com/path/'
      });

      const result2 = toReadableHtml(htmlWithRelativeLinks, {
        url: 'https://site2.org/'
      });

      expect(result1).toBeDefined();
      expect(result1).not.toBeNull();
      expect(result2).toBeDefined();
      expect(result2).not.toBeNull();
      const innerHTML1 = result1!.content?.innerHTML;
      expect(innerHTML1).toContain('包含一个<a href="https://site1.com/about">相对链接');
      expect(innerHTML1).toContain('有一个图片:<img src="https://site1.com/images/sample.jpg"');
      expect(innerHTML1).toContain('指向外部资源的<a href="https://external.com/">绝对链接');
      const innerHTML2 = result2!.content?.innerHTML;
      expect(innerHTML2).toContain('包含一个<a href="https://site2.org/about">相对链接');
      expect(innerHTML2).toContain('有一个图片:<img src="https://site2.org/images/sample.jpg"');
      expect(innerHTML2).toContain('指向外部资源的<a href="https://external.com/">绝对链接');

    });

    it('should handle missing baseUrl gracefully', () => {
      // 不提供baseUrl的情况
      const result = toReadableHtml(htmlWithRelativeLinks);

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.title).toBe('测试相对链接处理');
      expect(result!.textContent).toContain('这是文章的第一段内容');
      const innerHTML = result!.content?.innerHTML;
      expect(innerHTML).toContain(`包含一个<a href="${DefaultBaseUrl}/about">相对链接`);
      expect(innerHTML).toContain(`有一个图片:<img src="${DefaultBaseUrl}/images/sample.jpg"`);
      expect(innerHTML).toContain('指向外部资源的<a href="https://external.com/">绝对链接');
    });

    it('should process HTML with only relative paths correctly', () => {
      const minimalWithRelativePaths = `
        <a href="./page1.html">页面1</a>
        <img src="/images/logo.png">
        <a href="../docs/guide.pdf">用户指南</a>
      `;

      const result = toReadableHtml(minimalWithRelativePaths, {
        url: 'https://company.com/info/'
      });

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result!.textContent).toContain('页面1');
      expect(result!.textContent).toContain('用户指南');

      const innerHTML = result!.content?.innerHTML;
      expect(innerHTML).toContain('<a href="https://company.com/info/page1.html">页面1</a>');
      expect(innerHTML).toContain('<img src="https://company.com/images/logo.png">');
      expect(innerHTML).toContain('<a href="https://company.com/docs/guide.pdf">用户指南</a>');
      expect(result!.content?.querySelector('img')?.getAttribute('src')).toBe('https://company.com/images/logo.png');
    });
  })
});
