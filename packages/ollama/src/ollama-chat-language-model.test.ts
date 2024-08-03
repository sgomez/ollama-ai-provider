import { LanguageModelV1Prompt } from '@ai-sdk/provider'
import {
  convertReadableStreamToArray,
  JsonTestServer,
  StreamingTestServer,
} from '@ai-sdk/provider-utils/test'
import { describe, expect, it } from 'vitest'

import { createOllama } from '@/ollama-provider'

const TEST_PROMPT: LanguageModelV1Prompt = [
  { content: [{ text: 'Hello', type: 'text' }], role: 'user' },
]

const provider = createOllama()

const model = provider.chat('model')

describe('doGenerate', () => {
  const server = new JsonTestServer('http://127.0.0.1:11434/api/chat')

  server.setupTestEnvironment()

  function prepareJsonResponse({
    content = '',
    done_reason = 'stop',
    tool_calls,
    usage = {
      completion_tokens: 30,
      prompt_tokens: 4,
    },
  }: {
    content?: string
    done_reason?: string
    tool_calls?: Array<{
      function: {
        arguments: Record<string, unknown>
        name: string
      }
      id: string
      type: 'function'
    }>
    usage?: {
      completion_tokens: number
      prompt_tokens: number
    }
  } = {}) {
    server.responseBodyJson = {
      created_at: '2023-08-04T19:22:45.499127Z',
      done: true,
      done_reason,
      eval_count: usage.completion_tokens,
      eval_duration: 4_709_213_000,
      load_duration: 5_025_959,
      message: {
        content,
        role: 'assistant',
        tool_calls,
      },
      model: 'model',
      prompt_eval_count: usage.prompt_tokens,
      prompt_eval_duration: 325_953_000,
      total_duration: 5_043_500_667,
    }
  }

  it('should extract text response', async () => {
    prepareJsonResponse({ content: 'Hello, World!' })

    const { text } = await model.doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(text).toStrictEqual('Hello, World!')
  })

  it('should extract usage', async () => {
    prepareJsonResponse({
      content: '',
      usage: { completion_tokens: 5, prompt_tokens: 20 },
    })

    const { usage } = await model.doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(usage).toStrictEqual({
      completionTokens: 5,
      promptTokens: 20,
    })
  })

  it('should extract finish reason', async () => {
    prepareJsonResponse({
      content: '',
      done_reason: 'stop',
    })

    const response = await model.doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(response.finishReason).toStrictEqual('stop')
  })

  it('should support unknown finish reason', async () => {
    prepareJsonResponse({
      content: '',
      done_reason: 'eos',
    })

    const response = await model.doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(response.finishReason).toStrictEqual('other')
  })

  it('should expose the raw response headers', async () => {
    prepareJsonResponse({ content: '' })

    server.responseHeaders = {
      'test-header': 'test-value',
    }

    const { rawResponse } = await model.doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(rawResponse?.headers).toStrictEqual({
      // default headers:
      'content-length': '287',
      'content-type': 'application/json',

      // custom header
      'test-header': 'test-value',
    })
  })

  it('should pass the model and the messages', async () => {
    prepareJsonResponse({ content: '' })

    await model.doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(await server.getRequestBodyJson()).toStrictEqual({
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'model',
      options: {},
      stream: false,
    })
  })

  it('should pass settings', async () => {
    prepareJsonResponse()

    await provider
      .chat('model', {
        topK: 1,
      })
      .doGenerate({
        inputFormat: 'prompt',
        mode: { type: 'regular' },
        prompt: TEST_PROMPT,
      })

    expect(await server.getRequestBodyJson()).toStrictEqual({
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'model',
      options: {
        top_k: 1,
      },
      stream: false,
    })
  })

  it('should pass tools', async () => {
    prepareJsonResponse({ content: '' })

    await model.doGenerate({
      inputFormat: 'prompt',
      mode: {
        tools: [
          {
            name: 'test-tool',
            parameters: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              additionalProperties: false,
              properties: { value: { type: 'string' } },
              required: ['value'],
              type: 'object',
            },
            type: 'function',
          },
        ],
        type: 'regular',
      },
      prompt: TEST_PROMPT,
    })

    expect(await server.getRequestBodyJson()).toStrictEqual({
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'model',
      options: {},
      stream: false,
      tools: [
        {
          function: {
            name: 'test-tool',
            parameters: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              additionalProperties: false,
              properties: { value: { type: 'string' } },
              required: ['value'],
              type: 'object',
            },
          },
          type: 'function',
        },
      ],
    })
  })

  it('should pass headers', async () => {
    prepareJsonResponse({ content: '' })

    const providerWithHeaders = createOllama({
      headers: {
        'Custom-Provider-Header': 'provider-header-value',
      },
    })

    await providerWithHeaders.chat('gpt-3.5-turbo').doGenerate({
      headers: {
        'Custom-Request-Header': 'request-header-value',
      },
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    const requestHeaders = await server.getRequestHeaders()

    expect(requestHeaders).toStrictEqual({
      'content-type': 'application/json',
      'custom-provider-header': 'provider-header-value',
    })
  })

  it('should parse tool results', async () => {
    prepareJsonResponse({
      tool_calls: [
        {
          function: {
            arguments: { value: 'Spark' },
            name: 'test-tool',
          },
          id: 'call_O17Uplv4lJvD6DVdIvFFeRMw',
          type: 'function',
        },
      ],
    })

    const result = await model.doGenerate({
      inputFormat: 'prompt',
      mode: {
        tools: [
          {
            name: 'test-tool',
            parameters: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              additionalProperties: false,
              properties: { value: { type: 'string' } },
              required: ['value'],
              type: 'object',
            },
            type: 'function',
          },
        ],
        type: 'regular',
      },
      prompt: TEST_PROMPT,
    })

    expect(result.toolCalls).toStrictEqual([
      {
        args: '{"value":"Spark"}',
        toolCallId: 'call_O17Uplv4lJvD6DVdIvFFeRMw',
        toolCallType: 'function',
        toolName: 'test-tool',
      },
    ])
  })
})

describe('doStream', () => {
  const server = new StreamingTestServer('http://127.0.0.1:11434/api/chat')

  server.setupTestEnvironment()

  function prepareStreamResponse({
    content,
    usage = { eval_count: 290, prompt_eval_count: 26 },
  }: {
    content: string[]
    usage?: { eval_count: number; prompt_eval_count: number }
  }) {
    server.responseChunks = [
      ...content.map((text) => {
        return `{"model":"model","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"${text}"},"done":false}\n`
      }),
      `{"model":"model","created_at":"2024-05-04T01:59:32.137913Z","message":{"role":"assistant","content":""},"done":true,"total_duration":1820013000,"load_duration":5921416,"prompt_eval_count":${usage.prompt_eval_count},"prompt_eval_duration":1750224000,"eval_count":${usage.eval_count},"eval_duration":60669000}\n`,
    ]
  }

  it('should stream text deltas', async () => {
    prepareStreamResponse({
      content: ['Hello', ', ', 'World!'],
      usage: { eval_count: 290, prompt_eval_count: 26 },
    })

    const { stream } = await model.doStream({
      inputFormat: 'messages',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(await convertReadableStreamToArray(stream)).toStrictEqual([
      { textDelta: 'Hello', type: 'text-delta' },
      { textDelta: ', ', type: 'text-delta' },
      { textDelta: 'World!', type: 'text-delta' },
      {
        finishReason: 'stop',
        type: 'finish',
        usage: { completionTokens: 290, promptTokens: 26 },
      },
    ])
  })

  it('should stream tool deltas', async () => {
    // Arrange

    server.responseChunks = [
      `{"model":"model","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"{\\"name\\":"},"done":false}\n`,
      `{"model":"model","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"\\"json\\","},"done":false}\n`,
      `{"model":"model","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"\\"param"},"done":false}\n`,
      `{"model":"model","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"eters\\":"},"done":false}\n`,
      `{"model":"model","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"{\\"numb"},"done":false}\n`,
      `{"model":"model","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"ers\\":"},"done":false}\n`,
      `{"model":"model","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"[1,2]}"},"done":false}\n`,
      `{"model":"model","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"}"},"done":false}\n`,
      `{"model":"model","created_at":"2024-05-04T01:59:32.137913Z","message":{"role":"assistant","content":""},"done":true,"total_duration":1820013000,"load_duration":5921416,"prompt_eval_count":10,"prompt_eval_duration":1750224000,"eval_count":10,"eval_duration":60669000}\n`,
    ]
    // Act
    const { stream } = await model.doStream({
      inputFormat: 'prompt',
      mode: {
        tool: {
          description: 'Test tool',
          name: 'test-tool',
          parameters: {
            $schema: 'http://json-schema.org/draft-07/schema#',
            additionalProperties: false,
            properties: { value: { type: 'string' } },
            required: ['value'],
            type: 'object',
          },
          type: 'function',
        },
        type: 'object-tool',
      },
      prompt: TEST_PROMPT,
    })

    // Assert
    expect(await convertReadableStreamToArray(stream)).toStrictEqual([
      {
        argsTextDelta: '{"numb',
        toolCallId: expect.any(String),
        toolCallType: 'function',
        toolName: 'json',
        type: 'tool-call-delta',
      },
      {
        argsTextDelta: 'ers":',
        toolCallId: expect.any(String),
        toolCallType: 'function',
        toolName: 'json',
        type: 'tool-call-delta',
      },
      {
        argsTextDelta: '[1,2]}',
        toolCallId: expect.any(String),
        toolCallType: 'function',
        toolName: 'json',
        type: 'tool-call-delta',
      },
      {
        argsTextDelta: '}',
        toolCallId: expect.any(String),
        toolCallType: 'function',
        toolName: 'json',
        type: 'tool-call-delta',
      },
      {
        args: '{"numbers":[1,2]}',
        toolCallId: expect.any(String),
        toolCallType: 'function',
        toolName: 'json',
        type: 'tool-call',
      },
      {
        finishReason: 'stop',
        type: 'finish',
        usage: {
          completionTokens: 10,
          promptTokens: 10,
        },
      },
    ])
  })

  it('should expose the raw response headers', async () => {
    prepareStreamResponse({ content: [] })

    server.responseHeaders = {
      'test-header': 'test-value',
    }

    const { rawResponse } = await model.doStream({
      inputFormat: 'messages',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(rawResponse?.headers).toStrictEqual({
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      // default headers:
      'content-type': 'text/event-stream',

      // custom header
      'test-header': 'test-value',
    })
  })

  it('should pass the messages and the model', async () => {
    prepareStreamResponse({ content: [] })

    await model.doStream({
      inputFormat: 'messages',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(await server.getRequestBodyJson()).toStrictEqual({
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'model',
      options: {},
    })
  })

  it('should pass custom headers', async () => {
    prepareStreamResponse({ content: [] })

    const customProvider = createOllama({
      headers: {
        'Custom-Header': 'test-header',
      },
    })

    await customProvider.chat('gpt-3.5-turbo').doStream({
      inputFormat: 'messages',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    const requestHeaders = await server.getRequestHeaders()

    expect(requestHeaders).toStrictEqual({
      'content-type': 'application/json',
      'custom-header': 'test-header',
    })
  })
})
