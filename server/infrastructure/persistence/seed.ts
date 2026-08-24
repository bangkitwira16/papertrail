import type { DatabaseShape } from '../../domain/documents/models'

const now = new Date().toISOString()

export const seedData = (): DatabaseShape => ({
  users: [
    { id: 'user-alex', name: 'Alex Morgan', email: 'alex@papertrail.test', initials: 'AM', color: '#396246' },
    { id: 'user-maya', name: 'Maya Chen', email: 'maya@papertrail.test', initials: 'MC', color: '#8b5e4a' },
    { id: 'user-sam', name: 'Sam Rivera', email: 'sam@papertrail.test', initials: 'SR', color: '#4a628b' }
  ],
  documents: [
    { id: 'doc-welcome', title: 'Welcome to Papertrail', content: '<h1>A calmer place to write</h1><p>Papertrail keeps document work focused: write, invite a teammate, and pick up exactly where you left off.</p><h2>Try the core flow</h2><ul><li>Format this document with the toolbar.</li><li>Rename it from the title above.</li><li>Share it with <strong>maya@papertrail.test</strong>.</li></ul>', ownerId: 'user-alex', createdAt: now, updatedAt: now },
    { id: 'doc-research', title: 'Q3 research notes', content: '<h2>Interview themes</h2><p>Teams want fewer handoffs and clearer ownership. The strongest opportunity is a lightweight shared workspace.</p>', ownerId: 'user-maya', createdAt: now, updatedAt: now }
  ],
  shares: [{ documentId: 'doc-research', userId: 'user-alex', createdAt: now }]
})
