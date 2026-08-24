import { describe, expect, it } from 'vitest'
import { plainTextToHtml, safeFileName } from '../server/application/documents/validation'

describe('text import', () => {
  it('escapes unsafe markup and preserves paragraphs', () => {
    expect(plainTextToHtml('Hello <script>bad()</script>\n\nNext')).toBe('<p>Hello &lt;script&gt;bad()&lt;/script&gt;</p><p>Next</p>')
  })

  it('turns a supported filename into a readable document title', () => {
    expect(safeFileName('product_research-notes.md')).toBe('product research notes')
  })
})
