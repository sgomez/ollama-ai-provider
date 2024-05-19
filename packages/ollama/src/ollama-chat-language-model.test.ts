/* eslint-disable camelcase */

import { LanguageModelV1Prompt } from '@ai-sdk/provider'
import {
  convertStreamToArray,
  JsonTestServer,
  StreamingTestServer,
} from '@ai-sdk/provider-utils/test'
import { describe, expect, it } from 'vitest'

import { createOllama } from '@/ollama-provider'

const TEST_PROMPT: LanguageModelV1Prompt = [
  { content: [{ text: 'Hello', type: 'text' }], role: 'user' },
]

const provider = createOllama()
const model = provider.chat('llama3')

describe('goGenerate', () => {
  const server = new JsonTestServer('http://127.0.0.1:11434/api/chat')

  server.setupTestEnvironment()

  function prepareJsonResponse({
    content = '',
    usage = { eval_count: 290, prompt_eval_count: 26 },
  }: {
    content: string
    usage?: { eval_count: number; prompt_eval_count: number }
  }) {
    server.responseBodyJson = {
      created_at: '2023-08-04T19:22:45.499127Z',
      done: true,
      eval_count: usage.eval_count,
      eval_duration: 4_709_213_000,
      load_duration: 5_025_959,
      message: {
        content,
        role: 'assistant',
      },
      model: 'llama3',
      prompt_eval_count: usage.prompt_eval_count,
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
      content: 'Hello, World!',
      usage: { eval_count: 20, prompt_eval_count: 25 },
    })

    const { usage } = await model.doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(usage).toStrictEqual({
      completionTokens: 20,
      promptTokens: 25,
    })
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
      'content-type': 'application/json',

      // custom header
      'test-header': 'test-value',
    })
  })

  it('should pass the model and the prompt', async () => {
    prepareJsonResponse({ content: '' })

    await model.doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    expect(await server.getRequestBodyJson()).toStrictEqual({
      messages: [{ content: 'Hello', role: 'user' }],
      model: 'llama3',
      options: {},
      stream: false,
    })
  })

  it('should pass custom headers', async () => {
    prepareJsonResponse({ content: '' })

    const customProvider = createOllama({
      headers: {
        'Custom-Header': 'test-header',
      },
    })

    await customProvider.chat('gpt-3.5-turbo-instruct').doGenerate({
      inputFormat: 'prompt',
      mode: { type: 'regular' },
      prompt: TEST_PROMPT,
    })

    const requestHeaders = await server.getRequestHeaders()

    expect(requestHeaders.get('Custom-Header')).toStrictEqual('test-header')
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
        return `{"model":"llama3","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"${text}"},"done":false}\n`
      }),
      `{"model":"llama3","created_at":"2024-05-04T01:59:32.137913Z","message":{"role":"assistant","content":""},"done":true,"total_duration":1820013000,"load_duration":5921416,"prompt_eval_count":${usage.prompt_eval_count},"prompt_eval_duration":1750224000,"eval_count":${usage.eval_count},"eval_duration":60669000}\n`,
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

    expect(await convertStreamToArray(stream)).toStrictEqual([
      { textDelta: 'Hello', type: 'text-delta' },
      { textDelta: ', ', type: 'text-delta' },
      { textDelta: 'World!', type: 'text-delta' },
      {
        finishReason: 'stop',
        type: 'finish',
        usage: { completionTokens: 290, promptTokens: Number.NaN },
      },
    ])
  })

  it('should stream tool deltas', async () => {
    // Arrange

    server.responseChunks = [
      `{"model":"llama3","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"{\\"name\\":"},"done":false}\n`,
      `{"model":"llama3","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"\\"json\\","},"done":false}\n`,
      `{"model":"llama3","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"\\"argum"},"done":false}\n`,
      `{"model":"llama3","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"ents\\":"},"done":false}\n`,
      `{"model":"llama3","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"{\\"numb"},"done":false}\n`,
      `{"model":"llama3","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"ers\\":"},"done":false}\n`,
      `{"model":"llama3","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"[1,2]}"},"done":false}\n`,
      `{"model":"llama3","created_at":"2024-05-04T01:59:32.077465Z","message":{"role":"assistant","content":"}"},"done":false}\n`,
      `{"model":"llama3","created_at":"2024-05-04T01:59:32.137913Z","message":{"role":"assistant","content":""},"done":true,"total_duration":1820013000,"load_duration":5921416,"prompt_eval_count":10,"prompt_eval_duration":1750224000,"eval_count":10,"eval_duration":60669000}\n`,
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
    expect(await convertStreamToArray(stream)).toStrictEqual([
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
          promptTokens: Number.NaN,
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
      model: 'llama3',
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

    expect(requestHeaders.get('Custom-Header')).toStrictEqual('test-header')
  })
})
