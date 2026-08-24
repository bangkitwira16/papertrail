<script setup lang="ts">
import type { DocumentSummary } from '../domain/models'
import { documentPreview, formatRelativeDate } from '../utils/presentation'

defineProps<{ document: DocumentSummary }>()
</script>

<template>
  <NuxtLink :to="`/documents/${document.id}`" class="group flex min-h-64 flex-col rounded-[1.4rem] border border-black/7 bg-paper p-6 shadow-[0_8px_30px_rgba(23,33,28,0.04)] transition duration-300 hover:-translate-y-1 hover:border-sage-300 hover:shadow-[0_16px_45px_rgba(23,33,28,0.09)]">
    <div class="mb-8 flex items-start justify-between">
      <span class="grid size-11 place-items-center rounded-2xl bg-sage-100 text-xl text-sage-700">▤</span>
      <span :class="document.access === 'owner' ? 'bg-sage-100 text-sage-700' : 'bg-[#f4e9e4] text-[#8b5e4a]'" class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em]">
        {{ document.access === 'owner' ? 'Owned' : 'Shared' }}
      </span>
    </div>
    <h3 class="mb-2 text-xl font-bold tracking-tight transition group-hover:text-sage-700">{{ document.title }}</h3>
    <p class="line-clamp-3 text-sm leading-6 text-ink-500">{{ documentPreview(document.content) || 'A blank page, ready for your ideas.' }}</p>
    <div class="mt-auto flex items-end justify-between pt-8">
      <div>
        <p class="text-xs font-semibold text-ink-700">{{ document.access === 'owner' ? 'You' : document.ownerName }}</p>
        <p class="mt-0.5 text-xs text-ink-500">Edited {{ formatRelativeDate(document.updatedAt) }}</p>
      </div>
      <div v-if="document.sharedWith.length" class="flex -space-x-2">
        <span v-for="user in document.sharedWith.slice(0, 3)" :key="user.id" class="grid size-7 place-items-center rounded-full border-2 border-paper text-[9px] font-bold text-white" :style="{ backgroundColor: user.color }" :title="user.name">{{ user.initials }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
