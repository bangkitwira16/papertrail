// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest'
import { htmlToMarkdown, markdownFileName } from '../app/features/documents/utils/markdown-export'

describe('Markdown export', () => {
  it('converts supported rich-text content into readable Markdown', () => {
    const html = [
      '<h1>Product brief</h1>',
      '<p>A <strong>focused</strong> and <em>collaborative</em> workspace.</p>',
      '<ul><li><p>Create documents</p></li><li><p>Share work</p></li></ul>',
      '<blockquote><p>Keep the core flow clear.</p></blockquote>'
    ].join('')

    expect(htmlToMarkdown(html)).toBe([
      '# Product brief',
      '',
      'A **focused** and _collaborative_ workspace.',
      '',
      '- Create documents',
      '- Share work',
      '',
      '> Keep the core flow clear.'
    ].join('\n'))
  })

  it('creates a safe Markdown filename with a stable fallback', () => {
    expect(markdownFileName('  Q3 Product / Research  ')).toBe('q3-product-research.md')
    expect(markdownFileName('✨')).toBe('untitled-document.md')
  })
})
