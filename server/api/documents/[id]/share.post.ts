import { shareDocumentSchema } from '../../../application/documents/validation'
import { useDocumentService } from '../../../utils/document-service'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const parsed = shareDocumentSchema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message || 'Enter a valid email' })
  const result = await useDocumentService().shareDocument(id, parsed.data.userId, parsed.data.email)
  if (result.status === 'forbidden') throw createError({ statusCode: 403, statusMessage: 'Only the owner can share this document' })
  if (result.status === 'not_found') throw createError({ statusCode: 404, statusMessage: 'No seeded user has that email' })
  if (result.status === 'owner') throw createError({ statusCode: 400, statusMessage: 'You already own this document' })
  return result
})
