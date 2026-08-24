<script setup lang="ts">
import { documentClient } from '../api/document-client'
import { requestErrorMessage } from '../api/request-error'
import type { DocumentDetail } from '../domain/models'

const props = defineProps<{ document: DocumentDetail; userId: string }>()
const emit = defineEmits<{ close: []; shared: [document: DocumentDetail] }>()
const email = ref('')
const pending = ref(false)
const message = ref('')
const isError = ref(false)

async function share() {
  pending.value = true
  message.value = ''
  try {
    const result = await documentClient.share(props.document.id, props.userId, email.value)
    emit('shared', result.document)
    message.value = `Shared with ${email.value}`
    isError.value = false
    email.value = ''
  } catch (error: unknown) {
    message.value = requestErrorMessage(error, 'Could not share this document.')
    isError.value = true
  } finally { pending.value = false }
}
</script>

<template>
  <div class="fixed inset-0 z-50 grid place-items-center bg-ink-950/35 p-4 backdrop-blur-sm" @click.self="emit('close')">
    <section class="w-full max-w-md rounded-[1.5rem] bg-paper p-6 shadow-2xl md:p-8">
      <div class="mb-7 flex items-start justify-between">
        <div><p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-700">Invite people</p><h2 class="mt-2 text-2xl font-bold tracking-tight">Share “{{ document.title }}”</h2></div>
        <button class="grid size-9 place-items-center rounded-full text-ink-500 transition hover:bg-black/5 hover:text-ink-950" aria-label="Close" @click="emit('close')">×</button>
      </div>
      <form class="flex gap-2" @submit.prevent="share">
        <input v-model="email" required type="email" placeholder="teammate@papertrail.test" class="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-sage-500 focus:ring-3 focus:ring-sage-100">
        <button class="rounded-xl bg-ink-950 px-5 text-sm font-bold text-white transition hover:bg-sage-700 disabled:opacity-50" :disabled="pending">{{ pending ? 'Sharing…' : 'Share' }}</button>
      </form>
      <p class="mt-2 text-xs leading-5 text-ink-500">Try maya@papertrail.test or sam@papertrail.test. Shared users can edit.</p>
      <p v-if="message" class="mt-4 rounded-xl px-3 py-2 text-sm" :class="isError ? 'bg-red-50 text-red-700' : 'bg-sage-50 text-sage-700'">{{ message }}</p>
      <div class="mt-7 border-t border-black/7 pt-5">
        <p class="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-ink-500">People with access</p>
        <div class="flex items-center gap-3 py-2"><span class="grid size-9 place-items-center rounded-full bg-ink-950 text-xs font-bold text-white">{{ document.ownerName.split(' ').map(word => word[0]).join('').slice(0, 2) }}</span><div><p class="text-sm font-semibold">{{ document.ownerName }}</p><p class="text-xs text-ink-500">Owner</p></div></div>
        <div v-for="user in document.sharedWith" :key="user.id" class="flex items-center gap-3 py-2"><span class="grid size-9 place-items-center rounded-full text-xs font-bold text-white" :style="{ backgroundColor: user.color }">{{ user.initials }}</span><div class="min-w-0"><p class="truncate text-sm font-semibold">{{ user.name }}</p><p class="truncate text-xs text-ink-500">{{ user.email }} · Editor</p></div></div>
      </div>
    </section>
  </div>
</template>
