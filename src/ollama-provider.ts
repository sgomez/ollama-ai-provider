import { OllamaChatLanguageModel } from '@/ollama-chat-language-model'
import { OllamaChatModelId, OllamaChatSettings } from '@/ollama-chat-settings'
import { Ollama } from '@/ollama-facade'

export interface OllamaProvider {
  (
    modelId: OllamaChatModelId,
    settings?: OllamaChatSettings,
  ): OllamaChatLanguageModel

  chat(
    modelId: OllamaChatModelId,
    settings?: OllamaChatSettings,
  ): OllamaChatLanguageModel
}

export interface OllamaProviderSettings {
  baseURL?: string
  generateId?: () => string
  headers?: Record<string, string>
}

export function createOllama(
  options: OllamaProviderSettings = {},
): OllamaProvider {
  const ollama = new Ollama(options)

  const provider = function (
    modelId: OllamaChatModelId,
    settings?: OllamaChatSettings,
  ) {
    if (new.target) {
      throw new Error(
        'The Ollama model function cannot be called with the new keyword.',
      )
    }

    return ollama.chat(modelId, settings)
  }

  provider.chat = ollama.chat.bind(ollama)

  return provider as OllamaProvider
}

export const ollama = createOllama()
