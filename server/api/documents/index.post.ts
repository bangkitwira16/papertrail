import { createDocumentSchema } from '../../application/documents/validation'
import { useDocumentService } from '../../utils/document-service'

export default defineEventHandler(async (event) => {
  const parsed = createDocumentSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Invalid document' })
  return useDocumentService().createDocument(parsed.data.userId, parsed.data.title, parsed.data.content)
})
