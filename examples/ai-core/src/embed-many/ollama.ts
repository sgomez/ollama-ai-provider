#! /usr/bin/env -S pnpm tsx

import { embedMany } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaEmbeddingModelId } from 'ollama-ai-provider/src/ollama-embedding-settings'

import { buildProgram } from '../tools/command'

async function main(model: OllamaEmbeddingModelId) {
  const { embeddings, usage } = await embedMany({
    model: ollama.embedding(model),
    values: [
      'sunny day at the beach',
      'rainy afternoon in the city',
      'snowy night in the mountains',
    ],
  })

  console.log(embeddings)
  console.log(usage)
}

buildProgram('nomic-embed-text', main).catch(console.error)
