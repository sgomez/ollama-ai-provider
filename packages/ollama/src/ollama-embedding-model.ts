import {
  EmbeddingModelV1,
  TooManyEmbeddingValuesForCallError,
} from '@ai-sdk/provider'
import {
  createJsonResponseHandler,
  postJsonToApi,
} from '@ai-sdk/provider-utils'
import { z } from 'zod'

import {
  OllamaEmbeddingModelId,
  OllamaEmbeddingSettings,
} from '@/ollama-embedding-settings'
import { ollamaFailedResponseHandler } from '@/ollama-error'

type OllamaEmbeddingConfig = {
  baseURL: string
  fetch?: typeof fetch
  headers: () => Record<string, string | undefined>
  provider: string
}
export class OllamaEmbeddingModel implements EmbeddingModelV1<string> {
  readonly specificationVersion = 'v1'
  readonly modelId: OllamaEmbeddingModelId

  private readonly config: OllamaEmbeddingConfig
  private readonly settings: OllamaEmbeddingSettings

  get provider(): string {
    return this.config.provider
  }

  get maxEmbeddingsPerCall(): number {
    return this.settings.maxEmbeddingsPerCall ?? 2048
  }

  get supportsParallelCalls(): boolean {
    return false
  }

  constructor(
    modelId: OllamaEmbeddingModelId,
    settings: OllamaEmbeddingSettings,
    config: OllamaEmbeddingConfig,
  ) {
    this.modelId = modelId
    this.settings = settings
    this.config = config
  }

  async doEmbed({
    abortSignal,
    values,
  }: Parameters<EmbeddingModelV1<string>['doEmbed']>[0]): Promise<
    Awaited<ReturnType<EmbeddingModelV1<string>['doEmbed']>>
  > {
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        modelId: this.modelId,
        provider: this.provider,
        values,
      })
    }

    const { responseHeaders, value: response } = await postJsonToApi({
      abortSignal,
      body: {
        input: values,
        model: this.modelId,
      },
      failedResponseHandler: ollamaFailedResponseHandler,
      fetch: this.config.fetch,
      headers: this.config.headers(),
      successfulResponseHandler: createJsonResponseHandler(
        ollamaTextEmbeddingResponseSchema,
      ),
      url: `${this.config.baseURL}/embed`,
    })

    return {
      embeddings: response.embeddings,
      rawResponse: { headers: responseHeaders },
      usage: response.prompt_eval_count
        ? { tokens: response.prompt_eval_count }
        : undefined,
    }
  }
}

const ollamaTextEmbeddingResponseSchema = z.object({
  embeddings: z.array(z.array(z.number())),
  prompt_eval_count: z.number().nullable(),
})
