import type { DocumentWithAccess, ShareDocumentResult, StoredDocument, StoredUser } from '../../domain/documents/models'

export interface DocumentRepository {
  users(): Promise<StoredUser[]>
  list(userId: string): Promise<DocumentWithAccess[]>
  get(id: string, userId: string): Promise<DocumentWithAccess | null>
  create(input: Pick<StoredDocument, 'title' | 'content' | 'ownerId'>): Promise<DocumentWithAccess>
  update(id: string, userId: string, changes: Partial<Pick<StoredDocument, 'title' | 'content'>>): Promise<DocumentWithAccess | null>
  share(id: string, ownerId: string, email: string): Promise<ShareDocumentResult>
}
