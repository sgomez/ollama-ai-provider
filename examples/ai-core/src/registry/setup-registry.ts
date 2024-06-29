import { experimental_createProviderRegistry as createProviderRegistry } from 'ai'
import { ollama } from 'ollama-ai-provider'

export const registry = createProviderRegistry({
  // register provider with prefix and custom setup:
  ollama,
})
