import { generateId, withoutTrailingSlash } from '@ai-sdk/provider-utils'

import { OllamaChatLanguageModel } from '@/ollama-chat-language-model'
import { OllamaChatModelId, OllamaChatSettings } from '@/ollama-chat-settings'
import { OllamaProviderSettings } from '@/ollama-provider'

export class Ollama {
  readonly baseURL: string
  private readonly generateId: () => string
  readonly headers?: Record<string, string>

  constructor(options: OllamaProviderSettings = {}) {
    this.baseURL =
      withoutTrailingSlash(options.baseURL) ?? 'http://127.0.0.1:11434/api'
    this.generateId = options.generateId ?? generateId
    this.headers = options.headers
  }

  private get baseConfig() {
    return {
      baseURL: this.baseURL,
      headers: () => ({
        ...this.headers,
      }),
    }
  }

  chat(modelId: OllamaChatModelId, settings: OllamaChatSettings = {}) {
    return new OllamaChatLanguageModel(modelId, settings, {
      provider: 'ollama.chat',
      ...this.baseConfig,
      generateId: this.generateId,
    })
  }
}
