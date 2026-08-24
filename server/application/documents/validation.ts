import { z } from 'zod'

export const createDocumentSchema = z.object({
  userId: z.string().min(1),
  title: z.string().trim().min(1).max(120).default('Untitled document'),
  content: z.string().max(500_000).default('<p></p>')
})

export const updateDocumentSchema = z.object({
  userId: z.string().min(1),
  title: z.string().trim().min(1).max(120).optional(),
  content: z.string().max(500_000).optional()
}).refine(input => input.title !== undefined || input.content !== undefined, 'Nothing to update')

export const shareDocumentSchema = z.object({
  userId: z.string().min(1),
  email: z.string().trim().email().toLowerCase()
})

export function safeFileName(name: string) {
  return name.replace(/\.(txt|md)$/i, '').replace(/[_-]+/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 120) || 'Imported document'
}

export function plainTextToHtml(input: string) {
  const escaped = input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return escaped.split(/\n{2,}/).map(block => `<p>${block.replace(/\n/g, '<br>')}</p>`).join('')
}
