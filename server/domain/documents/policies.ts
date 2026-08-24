import type { StoredDocument, StoredShare } from './models'

export function canAccessDocument(document: StoredDocument, shares: StoredShare[], userId: string) {
  return document.ownerId === userId || shares.some(share => share.documentId === document.id && share.userId === userId)
}

export function canShareDocument(document: StoredDocument, userId: string) {
  return document.ownerId === userId
}
