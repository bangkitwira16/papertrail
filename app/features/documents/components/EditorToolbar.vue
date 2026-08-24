<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

defineProps<{ editor?: Editor }>()

interface ToolbarControl {
  label: string
  title: string
  action: (editor: Editor) => void
  disabled?: (editor: Editor) => boolean
  active?: (editor: Editor) => boolean
}

const controls: ToolbarControl[] = [
  { label: 'Undo', title: 'Undo', action: editor => editor.chain().focus().undo().run(), disabled: editor => !editor.can().undo() },
  { label: 'Redo', title: 'Redo', action: editor => editor.chain().focus().redo().run(), disabled: editor => !editor.can().redo() },
  { label: 'B', title: 'Bold', action: editor => editor.chain().focus().toggleBold().run(), active: editor => editor.isActive('bold') },
  { label: 'I', title: 'Italic', action: editor => editor.chain().focus().toggleItalic().run(), active: editor => editor.isActive('italic') },
  { label: 'U', title: 'Underline', action: editor => editor.chain().focus().toggleUnderline().run(), active: editor => editor.isActive('underline') },
  { label: 'H1', title: 'Heading 1', action: editor => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor => editor.isActive('heading', { level: 1 }) },
  { label: 'H2', title: 'Heading 2', action: editor => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor => editor.isActive('heading', { level: 2 }) },
  { label: '• List', title: 'Bulleted list', action: editor => editor.chain().focus().toggleBulletList().run(), active: editor => editor.isActive('bulletList') },
  { label: '1. List', title: 'Numbered list', action: editor => editor.chain().focus().toggleOrderedList().run(), active: editor => editor.isActive('orderedList') },
  { label: '❝', title: 'Quote', action: editor => editor.chain().focus().toggleBlockquote().run(), active: editor => editor.isActive('blockquote') }
]
</script>

<template>
  <div v-if="editor" class="flex flex-wrap items-center gap-1 border-y border-black/7 bg-white/70 px-3 py-2 backdrop-blur md:rounded-xl md:border md:px-4">
    <template v-for="(control, index) in controls" :key="control.title">
      <span v-if="index === 2 || index === 5 || index === 7" class="mx-1 h-6 w-px bg-black/8" />
      <button type="button" :title="control.title" :disabled="control.disabled?.(editor)" class="min-w-9 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink-700 transition hover:bg-sage-50 hover:text-sage-700 disabled:cursor-not-allowed disabled:opacity-30" :class="control.active?.(editor) ? 'bg-sage-100 text-sage-700' : ''" @click="control.action(editor)">
        <em v-if="control.label === 'I'">I</em>
        <u v-else-if="control.label === 'U'">U</u>
        <span v-else>{{ control.label }}</span>
      </button>
    </template>
  </div>
</template>
