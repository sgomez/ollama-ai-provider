/* eslint-disable camelcase */
import {
  LanguageModelV1,
  LanguageModelV1CallWarning,
  LanguageModelV1FinishReason,
  LanguageModelV1StreamPart,
  UnsupportedFunctionalityError,
} from '@ai-sdk/provider'
import {
  createJsonResponseHandler,
  ParseResult,
  postJsonToApi,
} from '@ai-sdk/provider-utils'
import { z } from 'zod'

import {
  convertToOllamaChatMessages,
  convertToOllamaGenerateMessage,
} from '@/convert-to-ollama-chat-messages'
import { mapOllamaFinishReason } from '@/map-ollama-finish-reason'
import { OllamaChatModelId, OllamaChatSettings } from '@/ollama-chat-settings'
import { ollamaFailedResponseHandler } from '@/ollama-error'
import { createJsonStreamResponseHandler } from '@/utils'

interface OllamaChatConfig {
  baseURL: string
  generateId: () => string
  headers: () => Record<string, string | undefined>
  provider: string
}

export class OllamaChatLanguageModel implements LanguageModelV1 {
  readonly specificationVersion = 'v1'
  readonly defaultObjectGenerationMode = 'json'

  constructor(
    public readonly modelId: OllamaChatModelId,
    public readonly settings: OllamaChatSettings,
    public readonly config: OllamaChatConfig,
  ) {}

  get provider(): string {
    return this.config.provider
  }

  private getArguments({
    inputFormat,
    mode,
    prompt,
  }: Parameters<LanguageModelV1['doGenerate']>[0]) {
    const type = mode.type

    const warnings: LanguageModelV1CallWarning[] = []

    const baseArguments = {
      ...(inputFormat === 'prompt'
        ? { messages: convertToOllamaGenerateMessage(prompt) }
        : { messages: convertToOllamaChatMessages(prompt) }),
      model: this.modelId,
    }

    switch (type) {
      case 'regular': {
        return {
          args: {
            ...baseArguments,
          },
          warnings,
        }
      }

      case 'object-json': {
        throw new UnsupportedFunctionalityError({
          functionality: 'object-json mode',
        })
      }

      case 'object-tool': {
        throw new UnsupportedFunctionalityError({
          functionality: 'object-tool mode',
        })
      }

      case 'object-grammar': {
        throw new UnsupportedFunctionalityError({
          functionality: 'object-grammar mode',
        })
      }

      default: {
        const _exhaustiveCheck: string = type
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`)
      }
    }
  }

  async doGenerate(
    options: Parameters<LanguageModelV1['doGenerate']>[0],
  ): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>> {
    const {
      args: { messages: rawPrompt, ...rawSettings },
      warnings,
    } = this.getArguments(options)

    const { responseHeaders, value: response } = await postJsonToApi({
      abortSignal: options.abortSignal,
      body: {
        ...rawSettings,
        prompt: rawPrompt,
        stream: false,
      },
      failedResponseHandler: ollamaFailedResponseHandler,
      headers: this.config.headers(),
      successfulResponseHandler: createJsonResponseHandler(
        ollamaChatResponseSchema,
      ),
      url: `${this.config.baseURL}/generate`,
    })

    return {
      finishReason: 'stop',
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      text: response.response,
      usage: {
        completionTokens: Number.NaN,
        promptTokens: response.prompt_eval_count || Number.NaN,
      },
      warnings,
    }
  }

  async doStream(
    options: Parameters<LanguageModelV1['doStream']>[0],
  ): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>> {
    const { args, warnings } = this.getArguments(options)

    const { responseHeaders, value: response } = await postJsonToApi({
      abortSignal: options.abortSignal,
      body: args,
      failedResponseHandler: ollamaFailedResponseHandler,
      headers: this.config.headers(),
      successfulResponseHandler: createJsonStreamResponseHandler(
        ollamaChatStreamChunkSchema,
      ),
      url: `${this.config.baseURL}/chat`,
    })

    const { messages: rawPrompt, ...rawSettings } = args
    let finishReason: LanguageModelV1FinishReason = 'other'
    let usage: { completionTokens: number; promptTokens: number } = {
      completionTokens: Number.NaN,
      promptTokens: Number.NaN,
    }

    return {
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      stream: response.pipeThrough(
        new TransformStream<
          ParseResult<z.infer<typeof ollamaChatStreamChunkSchema>>,
          LanguageModelV1StreamPart
        >({
          async flush(controller) {
            controller.enqueue({
              finishReason,
              type: 'finish',
              usage,
            })
          },
          async transform(chunk, controller) {
            if (!chunk.success) {
              controller.enqueue({ error: chunk.error, type: 'error' })
              return
            }

            const value = chunk.value

            if (value.done) {
              finishReason = mapOllamaFinishReason('stop')
              usage = {
                completionTokens: value.eval_count,
                promptTokens: Number.NaN,
              }
              return
            }

            if (value.message.content !== null) {
              controller.enqueue({
                textDelta: value.message.content,
                type: 'text-delta',
              })
            }
          },
        }),
      ),
      warnings,
    }
  }
}

const ollamaChatResponseSchema = z.object({
  context: z.number().array(),
  created_at: z.string(),
  done: z.literal(true),
  eval_count: z.number(),
  eval_duration: z.number(),
  load_duration: z.number().optional(),
  model: z.string(),
  prompt_eval_count: z.number().optional(),
  prompt_eval_duration: z.number().optional(),
  response: z.string(),
  total_duration: z.number(),
})

const ollamaChatStreamChunkSchema = z.discriminatedUnion('done', [
  z.object({
    created_at: z.string(),
    done: z.literal(false),
    message: z.object({
      content: z.string(),
      role: z.string(),
    }),
    model: z.string(),
  }),
  z.object({
    created_at: z.string(),
    done: z.literal(true),
    eval_count: z.number(),
    eval_duration: z.number(),
    load_duration: z.number().optional(),
    model: z.string(),
    prompt_eval_count: z.number().optional(),
    prompt_eval_duration: z.number().optional(),
    total_duration: z.number(),
  }),
])
