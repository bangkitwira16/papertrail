<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import EditorToolbar from './EditorToolbar.vue'

const props = defineProps<{ content: string }>()
const emit = defineEmits<{ change: [content: string] }>()
const editor = shallowRef<Editor>()

onMounted(() => {
  editor.value = new Editor({
    content: props.content,
    extensions: [StarterKit, Underline, Placeholder.configure({ placeholder: 'Start writing…' })],
    editorProps: { attributes: { 'aria-label': 'Document content' } },
    onUpdate: ({ editor }) => emit('change', editor.getHTML())
  })
})

watch(() => props.content, content => {
  if (editor.value && editor.value.getHTML() !== content) {
    editor.value.commands.setContent(content, { emitUpdate: false })
  }
})

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div>
    <div class="mx-auto mb-5 max-w-[1180px] px-4 md:mb-8 md:px-8">
      <EditorToolbar :editor="editor" />
    </div>
    <div class="editor-surface mx-auto min-h-[70vh] max-w-[900px] bg-paper px-8 py-12 shadow-[0_12px_50px_rgba(23,33,28,0.08)] sm:px-14 md:rounded-sm md:px-20 md:py-16">
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>
