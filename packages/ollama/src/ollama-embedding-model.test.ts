import { EmbeddingModelV1Embedding } from '@ai-sdk/provider'
import { JsonTestServer } from '@ai-sdk/provider-utils/test'

import { createOllama } from './ollama-provider'

const dummyEmbeddings = [
  [0.1, 0.2, 0.3, 0.4, 0.5],
  [0.6, 0.7, 0.8, 0.9, 1],
]
const testValues = ['sunny day at the beach', 'rainy day in the city']

const provider = createOllama({})
const model = provider.embedding('all-minilm')

describe('doEmbed', () => {
  const server = new JsonTestServer('http://127.0.0.1:11434/api/embed')

  server.setupTestEnvironment()

  function prepareJsonResponse({
    embeddings = dummyEmbeddings,
  }: {
    embeddings?: EmbeddingModelV1Embedding[]
  } = {}) {
    server.responseBodyJson = {
      embeddings,
      model: 'all-minilm',
    }
  }

  it('should extract embedding', async () => {
    prepareJsonResponse()

    const { embeddings } = await model.doEmbed({ values: testValues })

    expect(embeddings).toStrictEqual(dummyEmbeddings)
  })

  it('should expose the raw response headers', async () => {
    prepareJsonResponse()

    server.responseHeaders = {
      'test-header': 'test-value',
    }

    const { rawResponse } = await model.doEmbed({ values: testValues })

    expect(rawResponse?.headers).toStrictEqual({
      'content-length': '79',
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
      input: testValues,
      model: 'all-minilm',
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

    expect(requestHeaders).toStrictEqual({
      'content-type': 'application/json',
      'custom-header': 'test-header',
    })
  })
})
