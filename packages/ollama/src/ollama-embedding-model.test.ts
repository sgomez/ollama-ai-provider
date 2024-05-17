import { EmbeddingModelV1Embedding } from '@ai-sdk/provider'
import { JsonTestServer } from '@ai-sdk/provider-utils/test'

import { createOllama } from './ollama-provider'

const dummyEmbeddings = [0.1, 0.2, 0.3, 0.4, 0.5]
const testValues = ['sunny day at the beach']

const provider = createOllama({})
const model = provider.embedding('all-minilm')

describe('doEmbed', () => {
  const server = new JsonTestServer('http://127.0.0.1:11434/api/embeddings')

  server.setupTestEnvironment()

  function prepareJsonResponse({
    embedding = dummyEmbeddings,
  }: {
    embedding?: EmbeddingModelV1Embedding
  } = {}) {
    server.responseBodyJson = {
      embedding,
    }
  }

  it('should extract embedding', async () => {
    prepareJsonResponse()

    const { embeddings } = await model.doEmbed({ values: testValues })

    expect(embeddings).toStrictEqual([dummyEmbeddings])
  })

  it('should expose the raw response headers', async () => {
    prepareJsonResponse()

    server.responseHeaders = {
      'test-header': 'test-value',
    }

    const { rawResponse } = await model.doEmbed({ values: testValues })

    expect(rawResponse?.headers).toStrictEqual({
      // default headers:
      'content-type': 'application/json',

      // custom header
      'test-header': 'test-value',
    })
  })

  it('should pass the model and the values', async () => {
    prepareJsonResponse()

    await model.doEmbed({ values: testValues })

    expect(await server.getRequestBodyJson()).toStrictEqual({
      model: 'all-minilm',
      prompt: testValues[0],
    })
  })

  it('should pass custom headers', async () => {
    prepareJsonResponse()

    const ollamaProvider = createOllama({
      headers: {
        'Custom-Header': 'test-header',
      },
    })

    await ollamaProvider.embedding('all-minilm').doEmbed({
      values: testValues,
    })

    const requestHeaders = await server.getRequestHeaders()

    expect(requestHeaders.get('Custom-Header')).toStrictEqual('test-header')
  })
})
