import { htmlToMarkdown } from './html-to-markdown';

it('htmlToMarkdown test case basic-syntax', async () => {
  expect(await htmlToMarkdown()).toEqual('');
  const html = `<p>Hello <code>World</code>!</p>`;
  const mdStr = await htmlToMarkdown(html);
  expect(mdStr).toEqual('Hello `World`!\n')
  expect(await htmlToMarkdown(`<h2>Title 1</h2>`)).toEqual('## Title 1\n');
  expect(await htmlToMarkdown(`<h3>Title 1</h3>`)).toEqual('### Title 1\n');
  expect(await htmlToMarkdown(`<p><em>斜体文本</em></p>`)).toEqual('*斜体文本*\n');
  expect(await htmlToMarkdown(`<p><strong>粗体文本</strong></p>`)).toEqual('**粗体文本**\n');
  expect(await htmlToMarkdown(`<p><em><strong>粗斜体文本</strong></em></p>`)).toEqual('***粗斜体文本***\n');
  expect(await htmlToMarkdown(`<pre class="language-bash"><code class="language-bash code-highlight"><span class="code-line">$ npx idoc init myapp</span></code></pre>`)).toEqual(`\`\`\`bash\n$ npx idoc init myapp\n\`\`\`\n`);
  expect(await htmlToMarkdown(`<html> <body> <h1>我的第一个标题</h1> <p>我的第一个段落。</p> </body> </html>`)).toEqual('# 我的第一个标题\n\n我的第一个段落。\n');
  expect(await htmlToMarkdown(`<p> Hello <!--rehype:ignore:start--> <code>World</code> <!--rehype:ignore:end--> </p>`)).toEqual('Hello\n');
});

it('htmlToMarkdown test case ignore', async () => {
  expect(await htmlToMarkdown(`<p> Hello <!--rehype:ignore:start--> <code>World</code> <!--rehype:ignore:end--> </p>`)).toEqual('Hello\n');
});

it('htmlToMarkdown test list', async () => {
  expect(await htmlToMarkdown(`<ul class="contains-task-list"> <li class="task-list-item"><input type="checkbox" checked="" disabled=""> <code>idoc.yml</code> 在根目录下添加</li> <li class="task-list-item"><input type="checkbox" checked="" disabled=""> <code>idoc.chapters.yml</code> 左侧栏文件导航</li> <li class="task-list-item"><input type="checkbox" checked="" disabled=""> <code>注释配置</code> 在 markdown 文档中添加的配置</li> </ul>` ))
    .toEqual('* [x] `idoc.yml` 在根目录下添加\n* [x] `idoc.chapters.yml` 左侧栏文件导航\n* [x] `注释配置` 在 markdown 文档中添加的配置\n');
});

it('htmlToMarkdown test empty links', async () => {
  // Default: empty-link text is wrapped in [ ] instead of emitting [text]() broken links
  expect(await htmlToMarkdown(`<p>前 <a>无href链接</a> 后</p>`)).toEqual('前 [无href链接] 后\n');
  expect(await htmlToMarkdown(`<p>前 <a href="">空href</a> 后</p>`)).toEqual('前 [空href] 后\n');
  expect(await htmlToMarkdown(`<p>前 <a href="#">井号</a> 后</p>`)).toEqual('前 [井号] 后\n');
  // A link with no text at all is dropped entirely
  expect(await htmlToMarkdown(`<p>前 <a href="#"></a> 后</p>`)).toEqual('前 后\n');
  // Nested inline formatting inside an empty link is preserved
  expect(await htmlToMarkdown(`<p>前 <a><em>斜体</em>内容</a> 后</p>`)).toEqual('前 [*斜体*内容] 后\n');
  // Real links, including real in-page anchors, are untouched
  expect(await htmlToMarkdown(`<p>前 <a href="/x">正常</a> <a href="#section1">锚点</a> 后</p>`)).toEqual('前 [正常](/x) [锚点](#section1) 后\n');
  // Custom delimiters
  expect(await htmlToMarkdown(`<p>前 <a href="#">井号</a> 后</p>`, { emptyLinkBrackets: ['【', '】'] })).toEqual('前 【井号】 后\n');
  // false restores the old broken-link behavior
  expect(await htmlToMarkdown(`<p>前 <a href="#">井号</a> 后</p>`, { emptyLinkBrackets: false })).toEqual('前 [井号](#) 后\n');
  // Literal brackets in normal text are still escaped as before
  expect(await htmlToMarkdown(`<p>文字 [方括号] 文字</p>`)).toEqual('文字 \\[方括号] 文字\n');
});

const tableStr = `<table>
<thead>
<tr>
<th>Repo</th>
<th>Starred</th>
<th>Website</th>
</tr>
</thead>
<tbody>
<tr>
<td>MySQL Tutorial</td>
<td>1</td>
<td>2</td>
</tr>
<tr>
<td>Docker Tutorial</td>
<td>3</td>
<td>4</td>
</tr>
</tbody>
</table>
`;

it('htmlToMarkdown test list', async () => {
  const str = await htmlToMarkdown(tableStr);
  expect(str)
    .toEqual('| Repo            | Starred | Website |\n| --------------- | ------- | ------- |\n| MySQL Tutorial  | 1       | 2       |\n| Docker Tutorial | 3       | 4       |\n');
});
