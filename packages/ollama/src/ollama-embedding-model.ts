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

    const embeddings: Awaited<ReturnType<EmbeddingModelV1<string>['doEmbed']>> =
      {
        embeddings: [],
        rawResponse: { headers: {} },
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

    embeddings.embeddings = response.embeddings
    embeddings.rawResponse = { headers: responseHeaders }

    return embeddings
  }
}

const ollamaTextEmbeddingResponseSchema = z.object({
  embeddings: z.array(z.array(z.number())),
})
