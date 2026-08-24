type RequestErrorPayload = { statusMessage?: unknown }

export function requestErrorMessage(error: unknown, fallback: string) {
  if (!error || typeof error !== 'object' || !('data' in error)) return fallback
  const data = (error as { data?: RequestErrorPayload }).data
  return typeof data?.statusMessage === 'string' ? data.statusMessage : fallback
}
