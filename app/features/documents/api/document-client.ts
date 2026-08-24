import type { DocumentChanges, DocumentDetail, DocumentSummary, User } from '../domain/models'

export const documentClient = {
  users: () => $fetch<User[]>('/api/users'),

  list: (userId: string) =>
    $fetch<DocumentSummary[]>('/api/documents', { query: { userId } }),

  get: (id: string, userId: string) =>
    $fetch<DocumentDetail>(`/api/documents/${id}`, { query: { userId } }),

  create: (userId: string) =>
    $fetch<DocumentSummary>('/api/documents', {
      method: 'POST',
      body: { userId, title: 'Untitled document', content: '<p></p>' }
    }),

  update: (id: string, userId: string, changes: DocumentChanges) =>
    $fetch<DocumentDetail>(`/api/documents/${id}`, {
      method: 'PATCH',
      body: { userId, ...changes }
    }),

  share: (id: string, userId: string, email: string) =>
    $fetch<{ document: DocumentDetail }>(`/api/documents/${id}/share`, {
      method: 'POST',
      body: { userId, email }
    }),

  import: (file: File, userId: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('userId', userId)
    return $fetch<DocumentSummary>('/api/documents/import', { method: 'POST', body: form })
  }
}
