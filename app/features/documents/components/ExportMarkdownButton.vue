<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { downloadMarkdown } from '../utils/markdown-export'

const props = defineProps<{ editor?: Editor, documentTitle: string }>()
const state = ref<'idle' | 'exported' | 'error'>('idle')
let resetTimer: ReturnType<typeof setTimeout> | undefined

function exportDocument() {
  if (!props.editor) return
  try {
    downloadMarkdown(props.documentTitle, props.editor.getHTML())
    state.value = 'exported'
  } catch {
    state.value = 'error'
  }
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => { state.value = 'idle' }, 1800)
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <button
    type="button"
    title="Export as Markdown"
    :disabled="!editor"
    class="ml-auto rounded-lg border border-sage-200 bg-sage-50 px-3 py-1.5 text-sm font-semibold text-sage-800 transition hover:border-sage-300 hover:bg-sage-100 disabled:cursor-not-allowed disabled:opacity-40"
    @click="exportDocument"
  >
    {{ state === 'exported' ? 'Downloaded ✓' : state === 'error' ? 'Export failed' : '↓ Markdown' }}
  </button>
</template>
