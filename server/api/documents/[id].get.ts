import { useDocumentService } from '../../utils/document-service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const userId = getQuery(event).userId
  if (typeof userId !== 'string' || !userId) throw createError({ statusCode: 400, statusMessage: 'A user is required' })
  const document = await useDocumentService().getDocument(id, userId)
  if (!document) throw createError({ statusCode: 404, statusMessage: 'Document not found or access denied' })
  return document
})
