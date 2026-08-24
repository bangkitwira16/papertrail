import { describe, expect, it, vi } from 'vitest'
import { createDocumentService } from '../server/application/documents/document-service'
import type { DocumentRepository } from '../server/application/documents/document-repository'

describe('document application service', () => {
  it('keeps use-case inputs independent from persistence details', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'doc-1' })
    const repository = {
      users: vi.fn(), list: vi.fn(), get: vi.fn(), create, update: vi.fn(), share: vi.fn()
    } as unknown as DocumentRepository
    const service = createDocumentService(repository)

    await service.createDocument('owner-1', 'Product brief', '<p>Draft</p>')

    expect(create).toHaveBeenCalledWith({ ownerId: 'owner-1', title: 'Product brief', content: '<p>Draft</p>' })
  })
})
