#! /usr/bin/env -S pnpm tsx

import { cosineSimilarity, embedMany } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaEmbeddingModelId } from 'ollama-ai-provider/src/ollama-embedding-settings'

import { buildProgram } from '../tools/command'

async function main(model: OllamaEmbeddingModelId) {
  const { embeddings } = await embedMany({
    model: ollama.embedding(model),
    values: ['sunny day at the beach', 'rainy afternoon in the city'],
  })

  console.log(
    `cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`,
  )
}

buildProgram('nomic-embed-text', main).catch(console.error)
