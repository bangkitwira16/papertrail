import type { DocumentRepository } from './document-repository'

export function createDocumentService(repository: DocumentRepository) {
  return {
    listUsers: () => repository.users(),
    listDocuments: (userId: string) => repository.list(userId),
    getDocument: (id: string, userId: string) => repository.get(id, userId),
    createDocument: (ownerId: string, title: string, content: string) => repository.create({ ownerId, title, content }),
    updateDocument: (id: string, userId: string, changes: { title?: string; content?: string }) => repository.update(id, userId, changes),
    shareDocument: (id: string, ownerId: string, email: string) => repository.share(id, ownerId, email)
  }
}

export type DocumentService = ReturnType<typeof createDocumentService>
