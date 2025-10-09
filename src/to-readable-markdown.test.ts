// to-readable-markdown.test.ts
import { describe, it, expect } from 'vitest'
import { toReadableMarkdown } from './to-readable-markdown'

describe('toReadableMarkdown', () => {
  it('should convert simple HTML to readable markdown', async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Article</title>
        </head>
        <body>
          <article>
            <h1>Main Title</h1>
            <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
            <p>Another paragraph with a <a href="https://example.com">link</a>.</p>
          </article>
        </body>
      </html>
    `

    const result = await toReadableMarkdown(html)

    expect(result.success).toBe(true)
    expect(result.title).toBe('Test Article')
    expect(result.content).toMatchInlineSnapshot(`
      "## Main Title

      This is a paragraph with **bold text** and *italic text*.

      Another paragraph with a [link](https://example.com/).
      "
    `)
    expect(result.content).not.toContain('<')
    expect(result.error).toBeUndefined()
  })

  it('should handle complex HTML with lists and code blocks', async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Complex Article</title>
        </head>
        <body>
          <article>
            <h1>Programming Guide</h1>
            <p>Here are some steps:</p>
            <ol>
              <li>First step</li>
              <li>Second step with <code>inline code</code></li>
            </ol>
            <p>Some bullet points:</p>
            <ul>
              <li>Item one</li>
              <li>Item two</li>
            </ul>
            <pre><code class="language-js">function hello() {
  console.log("Hello World");
}</code></pre>
          </article>
        </body>
      </html>
    `

    const result = await toReadableMarkdown(html)

    expect(result.success).toBe(true)
    expect(result.title).toBe('Complex Article')
    expect(result.content).toMatchInlineSnapshot(`
      "## Programming Guide

      Here are some steps:

      1. First step
      2. Second step with \`inline code\`

      Some bullet points:

      * Item one
      * Item two

      \`\`\`js
      function hello() {
        console.log("Hello World");
      }
      \`\`\`
      "
    `)
  })

  it('should extract metadata correctly', async () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Metadata Test</title>
          <meta property="og:site_name" content="Test Site">
          <meta property="article:published_time" content="2023-01-01T00:00:00Z">
        </head>
        <body>
          <article>
            <h1>Metadata Test Article</h1>
            <p>Content here</p>
          </article>
        </body>
      </html>
    `

    const result = await toReadableMarkdown(html)

    expect(result.success).toBe(true)
    expect(result.title).toBe('Metadata Test')
    expect(result.lang).toBe('en')
    expect(result.siteName).toBe('Test Site')
    expect(result.publishedTime).toBe('2023-01-01T00:00:00Z')
  })

  it('should handle HTML with no article content', async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Empty Page</title>
        </head>
        <body>
          <div>No real content here</div>
        </body>
      </html>
    `

    const result = await toReadableMarkdown(html)

    expect(result.success).toBe(true)
    expect(result.title).toBe('Empty Page')
    expect(result.content).toBe('No real content here\n')
  })

  it('should pass text', async () => {
    const html = 'This is not HTML at all'

    const result = await toReadableMarkdown(html)

    expect(result.success).toBe(true)
    expect(result.content).toContain(html)
  })

  it('should handle HTML with tables', async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Table Test</title>
        </head>
        <body>
          <article>
            <h1>Table Example</h1>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>Jane</td>
                  <td>25</td>
                </tr>
              </tbody>
            </table>
          </article>
        </body>
      </html>
    `

    const result = await toReadableMarkdown(html)

    expect(result.success).toBe(true)
    expect(result.title).toBe('Table Test')
    expect(result.content).toContain('| Name | Age |')
    expect(result.content).toContain('| John | 30  |')
  })

  it('should handle HTML with images', async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Image Test</title>
        </head>
        <body>
          <article>
            <h1>Image Example</h1>
            <p>Here is an image:</p>
            <img src="https://example.com/image.jpg" alt="Example Image">
            <p>End of content.</p>
          </article>
        </body>
      </html>
    `

    const result = await toReadableMarkdown(html)

    expect(result.success).toBe(true)
    expect(result.title).toBe('Image Test')
    expect(result.content).toContain('![Example Image](https://example.com/image.jpg)')
  })

  it('should work with readability options', async () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Options Test</title>
        </head>
        <body>
          <div class="content">
            <h1>Custom Content</h1>
            <p>This is the main content we want.</p>
          </div>
          <div class="sidebar">
            <p>This is sidebar content we don't want.</p>
          </div>
        </body>
      </html>
    `

    const result = await toReadableMarkdown(html, {
      readabilityOptions: {
        classesToPreserve: ['content']
      },
    })

    expect(result.success).toBe(true)
    expect(result.content).toContain('# Custom Content')
    expect(result.content).toContain('This is the main content we want.')
  })
})