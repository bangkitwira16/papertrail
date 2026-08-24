import { documentClient } from '~/features/documents/api/document-client'
import type { User } from '~/features/documents/domain/models'

export const useCurrentUser = () => {
  const users = useState<User[]>('users', () => [])
  const currentUserId = useCookie<string>('papertrail-user', { default: () => 'user-alex', sameSite: 'lax' })
  const currentUser = computed(() => users.value.find(user => user.id === currentUserId.value) || users.value[0])

  const loadUsers = async () => {
    if (!users.value.length) users.value = await documentClient.users()
    if (!users.value.some(user => user.id === currentUserId.value) && users.value[0]) currentUserId.value = users.value[0].id
  }

  return { users, currentUser, currentUserId, loadUsers }
}
