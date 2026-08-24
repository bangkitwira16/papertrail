import type { Ref } from 'vue'
import { documentClient } from '../api/document-client'
import { requestErrorMessage } from '../api/request-error'
import type { DocumentSummary } from '../domain/models'
import { documentPreview } from '../utils/presentation'

export function useDocumentLibrary(currentUserId: Ref<string>) {
  const filter = ref<'all' | 'owner' | 'shared'>('all')
  const search = ref('')
  const activeAction = ref<'create' | 'import' | null>(null)
  const errorMessage = ref('')

  const { data: documents, pending, refresh } = useAsyncData(
    'documents',
    () => documentClient.list(currentUserId.value),
    { watch: [currentUserId], default: () => [] }
  )

  const filteredDocuments = computed(() => documents.value.filter(document => {
    const matchesFilter = filter.value === 'all' || document.access === filter.value
    const query = search.value.trim().toLowerCase()
    const matchesSearch = !query
      || document.title.toLowerCase().includes(query)
      || documentPreview(document.content).toLowerCase().includes(query)
    return matchesFilter && matchesSearch
  }))

  async function createDocument() {
    return runAction('create', () => documentClient.create(currentUserId.value))
  }

  async function importDocument(file: File) {
    return runAction('import', () => documentClient.import(file, currentUserId.value))
  }

  async function runAction(type: 'create' | 'import', action: () => Promise<DocumentSummary>) {
    activeAction.value = type
    errorMessage.value = ''
    try {
      return await action()
    } catch (error: unknown) {
      errorMessage.value = requestErrorMessage(error, `Could not ${type} the document.`)
      return null
    } finally {
      activeAction.value = null
    }
  }

  return {
    filter,
    search,
    documents,
    filteredDocuments,
    pending,
    refresh,
    activeAction,
    errorMessage,
    createDocument,
    importDocument
  }
}
