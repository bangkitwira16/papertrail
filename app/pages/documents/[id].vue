<script setup lang="ts">
import { useDocumentSession } from '~/features/documents/composables/useDocumentSession'

const route = useRoute()
const { currentUserId, loadUsers } = useCurrentUser()
await loadUsers()

const shareOpen = ref(false)
const { document, error, title, savingState, saveTitle, updateContent, applySharedDocument } = useDocumentSession(String(route.params.id), currentUserId)

const LazyDocumentEditor = defineAsyncComponent(() => import('~/features/documents/components/DocumentEditor.client.vue'))
const LazyShareDialog = defineAsyncComponent(() => import('~/features/documents/components/ShareDialog.vue'))
</script>

<template>
  <div class="min-h-screen bg-[#f4f3ee]">
    <AppHeader />
    <main v-if="document" class="pb-16">
      <div class="mx-auto max-w-[1180px] px-4 pt-6 md:px-8 md:pt-8">
        <div class="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <NuxtLink to="/" class="grid size-10 shrink-0 place-items-center rounded-xl border border-black/8 bg-white text-ink-700 transition hover:border-sage-300 hover:text-sage-700" aria-label="Back to documents">←</NuxtLink>
            <div class="min-w-0">
              <input v-model="title" class="block w-full truncate border-0 bg-transparent p-0 text-xl font-bold tracking-tight outline-none md:text-2xl" maxlength="120" aria-label="Document title" @blur="saveTitle" @keydown.enter.prevent="($event.target as HTMLInputElement).blur()">
              <div class="mt-1 flex items-center gap-2 text-xs text-ink-500">
                <span>{{ document.access === 'owner' ? 'Owned by you' : `Shared by ${document.ownerName}` }}</span><span>·</span>
                <span :class="savingState === 'error' ? 'text-red-600' : savingState === 'saving' ? 'text-ink-500' : 'text-sage-700'">{{ savingState === 'saving' ? 'Saving…' : savingState === 'error' ? 'Save failed — keep this tab open' : 'All changes saved' }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3 self-end lg:self-auto">
            <div v-if="document.sharedWith.length" class="hidden items-center -space-x-2 sm:flex">
              <span v-for="user in document.sharedWith" :key="user.id" class="grid size-8 place-items-center rounded-full border-2 border-[#f4f3ee] text-[10px] font-bold text-white" :style="{ backgroundColor: user.color }" :title="user.name">{{ user.initials }}</span>
            </div>
            <button v-if="document.access === 'owner'" class="rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sage-700" @click="shareOpen = true">Share</button>
          </div>
        </div>
      </div>

      <ClientOnly>
        <LazyDocumentEditor :content="document.content" :document-title="title" @change="updateContent" />
        <template #fallback><div class="mx-auto mt-8 min-h-[70vh] max-w-[900px] animate-pulse bg-white/70" /></template>
      </ClientOnly>
    </main>

    <main v-else class="grid min-h-[70vh] place-items-center px-6 text-center">
      <div>
        <span class="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">⌁</span>
        <h1 class="text-2xl font-bold">Document unavailable</h1>
        <p class="mt-2 max-w-md text-sm leading-6 text-ink-500">{{ error?.statusMessage || 'This document does not exist, or the selected demo user does not have access.' }}</p>
        <NuxtLink to="/" class="mt-6 inline-block rounded-xl bg-ink-950 px-5 py-3 text-sm font-bold text-white">Back to workspace</NuxtLink>
      </div>
    </main>

    <LazyShareDialog v-if="shareOpen && document" :document="document" :user-id="currentUserId" @close="shareOpen = false" @shared="applySharedDocument" />
  </div>
</template>
