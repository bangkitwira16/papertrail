<script setup lang="ts">
import type { User } from '~/features/documents/domain/models'

defineProps<{ users: User[]; modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const open = ref(false)
</script>

<template>
  <div class="relative">
    <button class="flex items-center gap-2 rounded-full border border-black/8 bg-white p-1.5 pr-3 shadow-sm transition hover:border-sage-300" @click="open = !open">
      <span class="grid size-8 place-items-center rounded-full text-xs font-bold text-white" :style="{ backgroundColor: users.find(user => user.id === modelValue)?.color || '#396246' }">
        {{ users.find(user => user.id === modelValue)?.initials || 'U' }}
      </span>
      <span class="hidden text-sm font-semibold text-ink-700 sm:block">{{ users.find(user => user.id === modelValue)?.name || 'Choose user' }}</span>
      <span class="text-xs text-ink-500">⌄</span>
    </button>
    <div v-if="open" class="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-2xl border border-black/8 bg-white p-2 shadow-xl">
      <p class="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">Demo as</p>
      <button v-for="user in users" :key="user.id" class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-sage-50" @click="emit('update:modelValue', user.id); open = false">
        <span class="grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white" :style="{ backgroundColor: user.color }">{{ user.initials }}</span>
        <span class="min-w-0">
          <span class="block truncate text-sm font-semibold">{{ user.name }}</span>
          <span class="block truncate text-xs text-ink-500">{{ user.email }}</span>
        </span>
        <span v-if="user.id === modelValue" class="ml-auto text-sage-700">✓</span>
      </button>
    </div>
  </div>
</template>
