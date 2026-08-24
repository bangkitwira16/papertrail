import { updateDocumentSchema } from '../../application/documents/validation'
import { useDocumentService } from '../../utils/document-service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const parsed = updateDocumentSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Invalid update' })
  const { userId, ...changes } = parsed.data
  const document = await useDocumentService().updateDocument(id, userId, changes)
  if (!document) throw createError({ statusCode: 404, statusMessage: 'Document not found or access denied' })
  return document
})
