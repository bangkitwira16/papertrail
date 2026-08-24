import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { DocumentRepository } from '../../application/documents/document-repository'
import type { DatabaseShape, DocumentWithAccess, StoredDocument } from '../../domain/documents/models'
import { canAccessDocument, canShareDocument } from '../../domain/documents/policies'
import { seedData } from './seed'

let mutationQueue = Promise.resolve()

function dataPath() {
  return resolve(process.cwd(), useRuntimeConfig().dataFile)
}

async function readDatabase(): Promise<DatabaseShape> {
  const path = dataPath()
  try {
    return JSON.parse(await readFile(path, 'utf8')) as DatabaseShape
  } catch (error: unknown) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined
    if (code !== 'ENOENT') throw error
    const initial = seedData()
    await persist(initial)
    return initial
  }
}

async function persist(data: DatabaseShape) {
  const path = dataPath()
  await mkdir(dirname(path), { recursive: true })
  const temporary = `${path}.${process.pid}.tmp`
  await writeFile(temporary, JSON.stringify(data, null, 2), 'utf8')
  await rename(temporary, path)
}

async function mutate<T>(operation: (data: DatabaseShape) => T | Promise<T>): Promise<T> {
  let result!: T
  const work = mutationQueue.then(async () => {
    const data = await readDatabase()
    result = await operation(data)
    await persist(data)
  })
  mutationQueue = work.catch(() => undefined)
  await work
  return result
}

function hydrate(data: DatabaseShape, document: StoredDocument, userId: string): DocumentWithAccess {
  const owner = data.users.find(user => user.id === document.ownerId)
  const sharedUserIds = data.shares.filter(share => share.documentId === document.id).map(share => share.userId)
  return { ...document, ownerName: owner?.name || 'Unknown owner', access: document.ownerId === userId ? 'owner' : 'shared', sharedWith: data.users.filter(user => sharedUserIds.includes(user.id)) }
}

export const fileDocumentRepository: DocumentRepository = {
  async users() {
    return (await readDatabase()).users
  },
  async list(userId) {
    const data = await readDatabase()
    return data.documents
      .filter(document => canAccessDocument(document, data.shares, userId))
      .map(document => hydrate(data, document, userId))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  },
  async get(id, userId) {
    const data = await readDatabase()
    const document = data.documents.find(item => item.id === id)
    return document && canAccessDocument(document, data.shares, userId) ? hydrate(data, document, userId) : null
  },
  async create(input) {
    return mutate(data => {
      const now = new Date().toISOString()
      const document: StoredDocument = { id: crypto.randomUUID(), ...input, createdAt: now, updatedAt: now }
      data.documents.push(document)
      return hydrate(data, document, input.ownerId)
    })
  },
  async update(id, userId, changes) {
    return mutate(data => {
      const document = data.documents.find(item => item.id === id)
      if (!document || !canAccessDocument(document, data.shares, userId)) return null
      Object.assign(document, changes, { updatedAt: new Date().toISOString() })
      return hydrate(data, document, userId)
    })
  },
  async share(id, ownerId, email) {
    return mutate(data => {
      const document = data.documents.find(item => item.id === id && canShareDocument(item, ownerId))
      if (!document) return { status: 'forbidden' as const }
      const user = data.users.find(item => item.email.toLowerCase() === email.toLowerCase())
      if (!user) return { status: 'not_found' as const }
      if (user.id === ownerId) return { status: 'owner' as const }
      if (!data.shares.some(share => share.documentId === id && share.userId === user.id)) data.shares.push({ documentId: id, userId: user.id, createdAt: new Date().toISOString() })
      return { status: 'shared' as const, document: hydrate(data, document, ownerId), user }
    })
  }
}
