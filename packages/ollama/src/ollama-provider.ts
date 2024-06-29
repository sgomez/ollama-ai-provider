import { withoutTrailingSlash } from '@ai-sdk/provider-utils'

import { OllamaChatLanguageModel } from '@/ollama-chat-language-model'
import { OllamaChatModelId, OllamaChatSettings } from '@/ollama-chat-settings'
import { OllamaEmbeddingModel } from '@/ollama-embedding-model'
import {
  OllamaEmbeddingModelId,
  OllamaEmbeddingSettings,
} from '@/ollama-embedding-settings'

export interface OllamaProvider {
  (
    modelId: OllamaChatModelId,
    settings?: OllamaChatSettings,
  ): OllamaChatLanguageModel

  chat(
    modelId: OllamaChatModelId,
    settings?: OllamaChatSettings,
  ): OllamaChatLanguageModel

  embedding(
    modelId: OllamaEmbeddingModelId,
    settings?: OllamaEmbeddingSettings,
  ): OllamaEmbeddingModel
}

export interface OllamaProviderSettings {
  /**
   * Base URL for Ollama API calls.
   */
  baseURL?: string
  /**
   * Custom fetch implementation. You can use it as a middleware to intercept
   * requests or to provide a custom fetch implementation for e.g. testing
   */
  fetch?: typeof fetch
  /**
   * @internal
   */
  generateId?: () => string
  /**
   * Custom headers to include in the requests.
   */
  headers?: Record<string, string>
}

export function createOllama(
  options: OllamaProviderSettings = {},
): OllamaProvider {
  const baseURL =
    withoutTrailingSlash(options.baseURL) ?? 'http://127.0.0.1:11434/api'

  const getHeaders = () => ({
    ...options.headers,
  })

  const createChatModel = (
    modelId: OllamaChatModelId,
    settings: OllamaChatSettings = {},
  ) =>
    new OllamaChatLanguageModel(modelId, settings, {
      baseURL,
      fetch: options.fetch,
      headers: getHeaders,
      provider: 'ollama.chat',
    })

  const createEmbeddingModel = (
    modelId: OllamaEmbeddingModelId,
    settings: OllamaEmbeddingSettings = {},
  ) =>
    new OllamaEmbeddingModel(modelId, settings, {
      baseURL,
      fetch: options.fetch,
      headers: getHeaders,
      provider: 'ollama.embedding',
    })

  const provider = function (
    modelId: OllamaChatModelId,
    settings?: OllamaChatSettings,
  ) {
    if (new.target) {
      throw new Error(
        'The Ollama model function cannot be called with the new keyword.',
      )
    }

    return createChatModel(modelId, settings)
  }

  provider.chat = createChatModel
  provider.embedding = createEmbeddingModel

  return provider as OllamaProvider
}

export const ollama = createOllama()
