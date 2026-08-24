function childMarkdown(element: Element): string {
  return Array.from(element.childNodes).map(nodeToMarkdown).join('')
}

function listItemMarkdown(element: Element): string {
  return childMarkdown(element).trim().replace(/\n{2,}/g, '\n')
}

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent?.replace(/\u00a0/g, ' ') || ''
  if (!(node instanceof Element)) return ''

  const content = childMarkdown(node)
  const tag = node.tagName.toLowerCase()

  if (tag === 'p') return `${content.trim()}\n\n`
  if (/^h[1-6]$/.test(tag)) return `${'#'.repeat(Number(tag[1]))} ${content.trim()}\n\n`
  if (tag === 'strong' || tag === 'b') return `**${content}**`
  if (tag === 'em' || tag === 'i') return `_${content}_`
  if (tag === 'u') return `<u>${content}</u>`
  if (tag === 's' || tag === 'del') return `~~${content}~~`
  if (tag === 'br') return '\n'
  if (tag === 'hr') return '---\n\n'
  if (tag === 'code' && node.parentElement?.tagName.toLowerCase() !== 'pre') return `\`${content}\``
  if (tag === 'pre') return `\`\`\`\n${node.textContent?.trim() || ''}\n\`\`\`\n\n`
  if (tag === 'a') return `[${content}](${node.getAttribute('href') || ''})`
  if (tag === 'blockquote') {
    const quote = content.trim().split('\n').map(line => `> ${line}`).join('\n')
    return `${quote}\n\n`
  }
  if (tag === 'ul') {
    const items = Array.from(node.children)
      .filter(child => child.tagName.toLowerCase() === 'li')
      .map(child => `- ${listItemMarkdown(child)}`)
      .join('\n')
    return `${items}\n\n`
  }
  if (tag === 'ol') {
    const items = Array.from(node.children)
      .filter(child => child.tagName.toLowerCase() === 'li')
      .map((child, index) => `${index + 1}. ${listItemMarkdown(child)}`)
      .join('\n')
    return `${items}\n\n`
  }
  if (tag === 'li') return content

  return content
}

export function htmlToMarkdown(html: string): string {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  return childMarkdown(parsed.body).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function markdownFileName(title: string): string {
  const base = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return `${base || 'untitled-document'}.md`
}

export function downloadMarkdown(title: string, html: string): void {
  const blob = new Blob([`${htmlToMarkdown(html)}\n`], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = markdownFileName(title)
  anchor.hidden = true
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
