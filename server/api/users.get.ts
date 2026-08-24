import { useDocumentService } from '../utils/document-service'

export default defineEventHandler(async () => useDocumentService().listUsers())
