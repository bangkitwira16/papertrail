<script setup lang="ts">
const { users, currentUserId, loadUsers } = useCurrentUser()
await loadUsers()
</script>

<template>
  <header class="flex h-20 items-center justify-between border-b border-black/6 bg-paper/90 px-5 backdrop-blur md:px-9">
    <NuxtLink to="/" class="group flex items-center gap-3">
      <span class="relative grid size-10 place-items-center overflow-hidden rounded-xl bg-ink-950 text-lg font-black text-white shadow-sm">
        P<span class="absolute -bottom-2 -right-2 size-5 rounded-full bg-coral-400" />
      </span>
      <span>
        <span class="block text-lg font-bold leading-5 tracking-tight">Papertrail</span>
        <span class="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500 sm:block">Team documents</span>
      </span>
    </NuxtLink>
    <UserSwitcher v-model="currentUserId" :users="users" />
  </header>
</template>
