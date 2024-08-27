import {
  experimental_createProviderRegistry as createProviderRegistry,
  experimental_customProvider as customProvider,
} from 'ai'
import { ollama } from 'ollama-ai-provider'

const myOllama = customProvider({
  fallbackProvider: ollama,
  languageModels: {
    multimodal: ollama('llava'),
    text: ollama('llama3.1'),
  },
})

export const registry = createProviderRegistry({
  ollama: myOllama,
})
