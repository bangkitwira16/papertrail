import { useDocumentService } from '../../utils/document-service'

export default defineEventHandler(async (event) => {
  const userId = getQuery(event).userId
  if (typeof userId !== 'string' || !userId) throw createError({ statusCode: 400, statusMessage: 'A user is required' })
  return useDocumentService().listDocuments(userId)
})
