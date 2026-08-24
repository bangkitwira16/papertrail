import type { Ref } from 'vue'
import { documentClient } from '../api/document-client'
import type { DocumentChanges, DocumentDetail } from '../domain/models'

export function useDocumentSession(documentId: string, currentUserId: Ref<string>) {
  const savingState = ref<'saved' | 'saving' | 'error'>('saved')
  const title = ref('')
  let saveTimer: ReturnType<typeof setTimeout> | undefined
  let pendingChanges: DocumentChanges = {}

  const { data: document, error } = useAsyncData(
    `document-${documentId}`,
    () => documentClient.get(documentId, currentUserId.value),
    { watch: [currentUserId] }
  )

  watch(document, value => {
    if (value) title.value = value.title
  }, { immediate: true })

  watch(currentUserId, resetPendingSave)

  function scheduleSave(changes: DocumentChanges) {
    if (!document.value) return
    pendingChanges = { ...pendingChanges, ...changes }
    savingState.value = 'saving'
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(flushSave, 700)
  }

  async function flushSave() {
    if (!document.value || !Object.keys(pendingChanges).length) return
    const changes = pendingChanges
    pendingChanges = {}
    try {
      document.value = await documentClient.update(document.value.id, currentUserId.value, changes)
      savingState.value = 'saved'
    } catch {
      pendingChanges = { ...changes, ...pendingChanges }
      savingState.value = 'error'
    }
  }

  function saveTitle() {
    const nextTitle = title.value.trim() || 'Untitled document'
    title.value = nextTitle
    scheduleSave({ title: nextTitle })
  }

  function updateContent(content: string) {
    scheduleSave({ content })
  }

  function applySharedDocument(updated: DocumentDetail) {
    document.value = updated
  }

  function resetPendingSave() {
    if (saveTimer) clearTimeout(saveTimer)
    pendingChanges = {}
    savingState.value = 'saved'
  }

  onBeforeUnmount(resetPendingSave)

  return { document, error, title, savingState, saveTitle, updateContent, applySharedDocument }
}
