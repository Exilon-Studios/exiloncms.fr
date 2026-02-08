import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export { ReactMarkdown, remarkGfm };

/**
 * Parse YAML frontmatter from markdown
 */
export function parseFrontmatter(markdown: string): { frontmatter: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  const yamlContent = match[1];
  const content = match[2];

  // Simple YAML parser for common cases
  const frontmatter: Record<string, any> = {};
  const lines = yamlContent.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    // Remove quotes from string values
    if (value.match(/^["'](.*)["']$/)) {
      value = value.slice(1, -1);
    }

    // Handle boolean values
    if (value === 'true') value = true;
    if (value === 'false') value = false;

    frontmatter[key] = value;
  }

  return { frontmatter, content };
}

/**
 * Build YAML frontmatter from object
 */
export function buildFrontmatter(frontmatter: Record<string, any>): string {
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    return '';
  }

  const lines = ['---'];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === 'string') {
      lines.push(`${key}: "${value}"`);
    } else if (value === true) {
      lines.push(`${key}: true`);
    } else if (value === false) {
      lines.push(`${key}: false`);
    } else if (typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: "${String(value)}"`);
    }
  }
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

/**
 * Convert HTML to Markdown while preserving YAML frontmatter
 */
export function htmlToMarkdown(html: string, frontmatter?: Record<string, any>): string {
  if (!html) return '';

  let markdown = html;
  let content = '';

  // Handle headings
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1');

  // Handle bold and italic
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Handle strikethrough
  markdown = markdown.replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~');
  markdown = markdown.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');

  // Handle inline code
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Handle code blocks (TipTap format)
  markdown = markdown.replace(/<pre[^>]*><code[^>]*class="language-(\w+)"[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, lang, code) => {
    return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
  });
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (match, code) => {
    return `\`\`\`\n${code.trim()}\n\`\`\``;
  });

  // Handle links
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Handle images
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

  // Handle unordered lists
  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, listContent) => {
    return listContent.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1').replace(/\n+$/, '\n');
  });

  // Handle ordered lists
  markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, listContent) => {
    let index = 1;
    return listContent.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${index++}. $1`).replace(/\n+$/, '\n');
  });

  // Handle blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, quoteContent) => {
    const lines = quoteContent.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n').split('\n');
    return lines.map(line => line.trim() ? `> ${line}` : '>').join('\n') + '\n';
  });

  // Handle horizontal rules
  markdown = markdown.replace(/<hr[^>]*>/gi, '---');

  // Handle paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1');

  // Handle line breaks
  markdown = markdown.replace(/<br[^>]*>/gi, '\n');

  // Handle divs (common from rich text editors)
  markdown = markdown.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');

  // Clean up HTML tags that might remain
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  // Decode HTML entities
  const textarea = document.createElement('textarea');
  markdown = markdown.replace(/&([^;]+);/g, (match, entity) => {
    textarea.innerHTML = match;
    return textarea.value || match;
  });

  content = markdown.trim();

  // Rebuild with frontmatter if provided
  if (frontmatter && Object.keys(frontmatter).length > 0) {
    const frontmatterStr = buildFrontmatter(frontmatter);
    return frontmatterStr + content;
  }

  return content;
}

/**
 * Convert Markdown to HTML (for TipTap editor)
 * Preserves YAML frontmatter separately
 */
export function markdownToHtml(markdown: string): { html: string; frontmatter: Record<string, any> } {
  if (!markdown) return { html: '', frontmatter: {} };

  // Parse frontmatter
  const { frontmatter, content } = parseFrontmatter(markdown);

  let html = content;

  // Escape HTML
  html = html.replace(/&/g, '&amp;');
  html = html.replace(/</g, '&lt;');
  html = html.replace(/>/g, '&gt;');

  // Handle code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
  });

  // Handle inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Handle headings (exclude first heading if it's the title from frontmatter)
  html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

  // Handle bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Handle strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Handle links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Handle images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Handle blockquotes
  html = html.replace(/^&gt; (.*$)/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Handle horizontal rules
  html = html.replace(/^---$/gm, '<hr />');

  // Handle unordered lists
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Handle ordered lists
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ol>$&</ol>');

  // Handle paragraphs
  html = html.replace(/^(?!<[a-z])(.*$)/gm, '<p>$1</p>');

  // Handle line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<[hou])/g, '$1');
  html = html.replace(/(<\/[a-z]+)><\/p>/g, '$1');

  return { html, frontmatter };
}
