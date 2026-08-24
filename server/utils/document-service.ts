import { createDocumentService } from '../application/documents/document-service'
import { fileDocumentRepository } from '../infrastructure/persistence/file-document-repository'
import { supabaseDocumentRepository } from '../infrastructure/persistence/supabase-document-repository'

export function useDocumentService() {
  const config = useRuntimeConfig()
  const repository = config.supabaseUrl && config.supabaseSecretKey
    ? supabaseDocumentRepository
    : fileDocumentRepository
  return createDocumentService(repository)
}
