import { fromHtml, type Options as FromHtmlOptions } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';
import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

// Overload signatures for the function
/**
 * Ensures a <base> tag exists in an HTML string.
 * @param html The raw HTML string to process.
 * @param baseUrl The URL for the <base> tag's href attribute.
 * @returns A new HTML string with the <base> tag, or undefined if no changes were made.
 */
export function ensureBaseUrl(html: string, baseUrl: string, options?: FromHtmlOptions): string | undefined;
/**
 * Ensures a <base> tag exists in a HAST tree.
 * @param tree The HAST tree (Root node) to process.
 * @param baseUrl The URL for the <base> tag's href attribute.
 * @returns The modified HAST tree, or undefined if no changes were made.
 */
export function ensureBaseUrl(tree: Root, baseUrl: string, options?: FromHtmlOptions): Root | undefined;

/**
 * Ensures a <base> tag exists in an HTML document (provided as a string or a HAST tree).
 *
 * This function checks for the presence of a <base> tag, and if not found,
 * inserts one at the beginning of the <head> element. It can handle both
 * raw HTML strings and HAST trees as input, returning the same type.
 *
 * @param input The raw HTML string or HAST tree.
 * @param baseUrl The URL to set as the href for the <base> tag.
 * @returns A new HTML string or a modified HAST tree (matching the input type), or undefined if no changes were made.
 */
export function ensureBaseUrl(input: string | Root, baseUrl: string, options?: FromHtmlOptions): string | Root | undefined {
  const isStringInput = typeof input === 'string';

  // 1. If input is a string, parse it into a HAST tree. Otherwise, use the provided tree.
  const tree: Root = isStringInput ? fromHtml(input as string, { fragment: false, ...options }) : (input as Root);

  let baseTagExists = false;
  let headNode: Element | null | undefined;
  let htmlNode: Element | null | undefined;

  // 2. Traverse the tree to check for an existing <base> tag and find the <head>.
  visit(tree, 'element', (node: Element) => {
    if (node.tagName === 'base') {
      baseTagExists = true;
      return false; // Stop traversal early
    }
    if (node.tagName === 'head' && !headNode) {
      headNode = node;
    }
    if (node.tagName === 'html' && !htmlNode) {
      htmlNode = node;
    }
  });

  // 3. If a <base> tag already exists, return undefined
  if (baseTagExists) {
    console.debug('A <base> tag already exists. No changes made.');
    return undefined;
  }

  // 4. If no <head> tag exists, create one
  if (!headNode) {
    console.debug('No <head> element found. Creating <head> element.');
    headNode = {
      type: 'element',
      tagName: 'head',
      properties: {},
      children: []
    };

    // Add head to html node if it exists, otherwise add it as the first child of the tree
    if (htmlNode) {
      htmlNode.children.unshift(headNode);
    } else {
      // Find the html root element and insert head as first element
      const bodyIndex = tree.children.findIndex(child =>
        child.type === 'element' && child.tagName === 'body'
      );

      if (bodyIndex !== -1) {
        tree.children.splice(bodyIndex, 0, headNode);
      } else {
        // If no body found, just add head at the beginning
        tree.children.unshift(headNode);
      }
    }
  }

  // 5. Create and add the new <base> element.
  const baseElement: Element = {
    type: 'element',
    tagName: 'base',
    properties: { href: baseUrl },
    children: [],
  };
  headNode.children.unshift(baseElement);

  // 6. Return the result in the same type as the input.
  if (isStringInput) {
    return toHtml(tree);
  } else {
    return tree;
  }
}

// --- Example Usage ---
/*
const htmlContent = `
  <html>
    <head>
      <title>My Document</title>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <h1>Hello</h1>
      <a href="/about.html">About</a>
    </body>
  </html>
`;
const newBaseUrl = 'https://www.my-awesome-site.com/content/';

// --- Usage 1: String in, String out ---
console.log('--- Processing HTML string ---');
const modifiedHtmlString = ensureBaseUrl(htmlContent, newBaseUrl);
console.log(modifiedHtmlString);

// --- Usage 2: HAST Tree in, HAST Tree out ---
console.log('\n--- Processing HAST tree ---');
const originalTree = fromHtml(htmlContent, { fragment: false });
const modifiedTree = ensureBaseUrl(originalTree, newBaseUrl);

// To prove it worked, we can serialize the returned tree to HTML
console.log('Serialized HAST tree after modification:');
console.log(toHtml(modifiedTree));
*/