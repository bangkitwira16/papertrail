import { describe, expect, it } from 'vitest'
import { canAccessDocument, canShareDocument } from '../server/domain/documents/policies'
import type { StoredDocument, StoredShare } from '../server/domain/documents/models'

const document: StoredDocument = {
  id: 'document-1',
  title: 'Plan',
  content: '<p>Draft</p>',
  ownerId: 'owner-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
}
const shares: StoredShare[] = [{ documentId: 'document-1', userId: 'editor-1', createdAt: '2026-01-01T00:00:00.000Z' }]

describe('document access rules', () => {
  it('allows the owner and explicitly shared users to open a document', () => {
    expect(canAccessDocument(document, shares, 'owner-1')).toBe(true)
    expect(canAccessDocument(document, shares, 'editor-1')).toBe(true)
  })

  it('denies unrelated users and reserves sharing for the owner', () => {
    expect(canAccessDocument(document, shares, 'stranger-1')).toBe(false)
    expect(canShareDocument(document, 'owner-1')).toBe(true)
    expect(canShareDocument(document, 'editor-1')).toBe(false)
  })
})
