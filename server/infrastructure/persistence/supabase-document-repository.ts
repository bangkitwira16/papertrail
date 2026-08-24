import { createClient } from '@supabase/supabase-js'
import type { DocumentRepository } from '../../application/documents/document-repository'
import type { DocumentWithAccess, StoredUser } from '../../domain/documents/models'

function client() {
  const config = useRuntimeConfig()
  return createClient(String(config.supabaseUrl), String(config.supabaseSecretKey), { auth: { persistSession: false, autoRefreshToken: false } })
}

interface SupabaseUserRow {
  id: string
  name: string
  email: string
  initials: string
  color: string
}

interface SupabaseDocumentRow {
  id: string
  title: string
  content: string
  owner_id: string
  created_at: string
  updated_at: string
  owner?: { name: string } | null
  document_shares?: Array<{ user: SupabaseUserRow | null }>
}

function mapUser(row: SupabaseUserRow): StoredUser {
  return { id: row.id, name: row.name, email: row.email, initials: row.initials, color: row.color }
}

function mapDocument(row: SupabaseDocumentRow, userId: string): DocumentWithAccess {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    ownerId: row.owner_id,
    ownerName: row.owner?.name || 'Unknown owner',
    access: row.owner_id === userId ? 'owner' : 'shared',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sharedWith: (row.document_shares || []).flatMap(share => share.user ? [mapUser(share.user)] : [])
  }
}

const documentSelect = '*, owner:app_users!documents_owner_id_fkey(name), document_shares(user:app_users(*))'

async function getDocument(id: string, userId: string) {
  const supabase = client()
  const { data: document, error } = await supabase.from('documents').select(documentSelect).eq('id', id).maybeSingle()
  if (error) throw error
  if (!document) return null
  if (document.owner_id !== userId) {
    const { data: share } = await supabase.from('document_shares').select('document_id').eq('document_id', id).eq('user_id', userId).maybeSingle()
    if (!share) return null
  }
  return mapDocument(document as unknown as SupabaseDocumentRow, userId)
}

export const supabaseDocumentRepository: DocumentRepository = {
  async users() {
    const { data, error } = await client().from('app_users').select('*').order('name')
    if (error) throw error
    return data.map(row => mapUser(row as SupabaseUserRow))
  },
  async list(userId) {
    const supabase = client()
    const { data: shares, error: shareError } = await supabase.from('document_shares').select('document_id').eq('user_id', userId)
    if (shareError) throw shareError
    const ids = (shares || []).map(row => row.document_id)
    const filter = ids.length ? `owner_id.eq.${userId},id.in.(${ids.join(',')})` : `owner_id.eq.${userId}`
    const { data, error } = await supabase.from('documents').select(documentSelect).or(filter).order('updated_at', { ascending: false })
    if (error) throw error
    return data.map(row => mapDocument(row as unknown as SupabaseDocumentRow, userId))
  },
  get: getDocument,
  async create(input) {
    const { data, error } = await client().from('documents').insert({ title: input.title, content: input.content, owner_id: input.ownerId }).select(documentSelect).single()
    if (error) throw error
    return mapDocument(data as unknown as SupabaseDocumentRow, input.ownerId)
  },
  async update(id, userId, changes) {
    if (!await getDocument(id, userId)) return null
    const values: Record<string, string> = { updated_at: new Date().toISOString() }
    if (changes.title !== undefined) values.title = changes.title
    if (changes.content !== undefined) values.content = changes.content
    const { data, error } = await client().from('documents').update(values).eq('id', id).select(documentSelect).single()
    if (error) throw error
    return mapDocument(data as unknown as SupabaseDocumentRow, userId)
  },
  async share(id, ownerId, email) {
    const supabase = client()
    const { data: document } = await supabase.from('documents').select('id, owner_id').eq('id', id).eq('owner_id', ownerId).maybeSingle()
    if (!document) return { status: 'forbidden' }
    const { data: user } = await supabase.from('app_users').select('*').ilike('email', email).maybeSingle()
    if (!user) return { status: 'not_found' }
    if (user.id === ownerId) return { status: 'owner' }
    const { error } = await supabase.from('document_shares').upsert({ document_id: id, user_id: user.id }, { onConflict: 'document_id,user_id' })
    if (error) throw error
    const hydrated = await getDocument(id, ownerId)
    return { status: 'shared', document: hydrated!, user: mapUser(user as SupabaseUserRow) }
  }
}
