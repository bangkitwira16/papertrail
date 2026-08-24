<script setup lang="ts">
import DocumentCard from '~/features/documents/components/DocumentCard.vue'
import EmptyDocumentState from '~/features/documents/components/EmptyDocumentState.vue'
import { useDocumentLibrary } from '~/features/documents/composables/useDocumentLibrary'

const { currentUserId, currentUser, loadUsers } = useCurrentUser()
await loadUsers()

const fileInput = ref<HTMLInputElement>()
const { filter, search, filteredDocuments, pending, activeAction, errorMessage, createDocument, importDocument } = useDocumentLibrary(currentUserId)

async function handleCreate() {
  const document = await createDocument()
  if (document) await navigateTo(`/documents/${document.id}`)
}

async function importFile(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const document = await importDocument(file)
  if (fileInput.value) fileInput.value.value = ''
  if (document) await navigateTo(`/documents/${document.id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f3ee]">
    <AppHeader />
    <main class="mx-auto max-w-[1440px] px-5 py-10 md:px-9 lg:py-14">
      <section class="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-sage-700">Workspace</p>
          <h1 class="text-4xl font-bold tracking-[-0.04em] md:text-5xl">Good {{ new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening' }}, {{ currentUser?.name.split(' ')[0] }}.</h1>
          <p class="mt-3 max-w-xl text-base leading-7 text-ink-500">Make progress on your writing, or invite someone into the work.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <input ref="fileInput" type="file" accept=".txt,.md,text/plain,text/markdown" class="hidden" @change="importFile">
          <button class="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-bold shadow-sm transition hover:border-sage-300 hover:bg-sage-50 disabled:opacity-50" :disabled="activeAction === 'import'" @click="fileInput?.click()">
            {{ activeAction === 'import' ? 'Importing…' : '↑ Import file' }}
          </button>
          <button class="rounded-xl bg-ink-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sage-700 disabled:opacity-50" :disabled="activeAction === 'create'" @click="handleCreate">
            {{ activeAction === 'create' ? 'Creating…' : '+ New document' }}
          </button>
        </div>
      </section>

      <p v-if="errorMessage" class="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ errorMessage }}</p>

      <section class="mb-7 flex flex-col gap-4 border-b border-black/8 pb-5 md:flex-row md:items-center md:justify-between">
        <div class="flex gap-1 rounded-xl bg-black/[0.045] p-1">
          <button v-for="option in (['all', 'owner', 'shared'] as const)" :key="option" class="rounded-lg px-4 py-2 text-sm font-semibold capitalize transition" :class="filter === option ? 'bg-white text-ink-950 shadow-sm' : 'text-ink-500 hover:text-ink-950'" @click="filter = option">
            {{ option === 'owner' ? 'Owned by me' : option }}
          </button>
        </div>
        <label class="relative block md:w-72">
          <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">⌕</span>
          <input v-model="search" type="search" placeholder="Search documents" class="w-full rounded-xl border border-black/8 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-ink-500 focus:border-sage-500 focus:ring-3 focus:ring-sage-100">
        </label>
      </section>

      <div v-if="pending" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div v-for="i in 3" :key="i" class="h-64 animate-pulse rounded-[1.4rem] bg-white/70" />
      </div>
      <div v-else class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DocumentCard v-for="document in filteredDocuments" :key="document.id" :document="document" />
        <EmptyDocumentState v-if="!filteredDocuments.length" />
      </div>

      <p class="mt-6 text-xs leading-5 text-ink-500">Import supports .txt and .md files up to 1 MB. Switch demo users above to verify shared access.</p>
    </main>
  </div>
</template>
