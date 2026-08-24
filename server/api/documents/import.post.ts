import { plainTextToHtml, safeFileName } from '../../application/documents/validation'
import { useDocumentService } from '../../utils/document-service'

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'file')
  const userId = parts?.find(part => part.name === 'userId')?.data.toString()
  if (!file?.filename || !file.data || !userId) throw createError({ statusCode: 400, statusMessage: 'Choose a file to import' })
  if (!/\.(txt|md)$/i.test(file.filename)) throw createError({ statusCode: 415, statusMessage: 'Only .txt and .md files are supported' })
  if (file.data.byteLength > 1_000_000) throw createError({ statusCode: 413, statusMessage: 'Files must be smaller than 1 MB' })
  return useDocumentService().createDocument(userId, safeFileName(file.filename), plainTextToHtml(file.data.toString('utf8')))
})
