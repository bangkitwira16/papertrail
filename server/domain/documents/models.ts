export interface StoredUser {
  id: string
  name: string
  email: string
  initials: string
  color: string
}

export interface StoredDocument {
  id: string
  title: string
  content: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface StoredShare {
  documentId: string
  userId: string
  createdAt: string
}

export interface DatabaseShape {
  users: StoredUser[]
  documents: StoredDocument[]
  shares: StoredShare[]
}

export type DocumentWithAccess = StoredDocument & {
  ownerName: string
  access: 'owner' | 'shared'
  sharedWith: StoredUser[]
}

export type ShareDocumentResult =
  | { status: 'forbidden' | 'not_found' | 'owner' }
  | { status: 'shared'; document: DocumentWithAccess; user: StoredUser }
