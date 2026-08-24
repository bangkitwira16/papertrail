export interface User {
  id: string
  name: string
  email: string
  initials: string
  color: string
}

export interface DocumentSummary {
  id: string
  title: string
  content: string
  ownerId: string
  ownerName: string
  access: 'owner' | 'shared'
  updatedAt: string
  createdAt: string
  sharedWith: User[]
}

export type DocumentDetail = DocumentSummary

export interface DocumentChanges {
  title?: string
  content?: string
}
