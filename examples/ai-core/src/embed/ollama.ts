#! /usr/bin/env -S pnpm tsx

import { embed } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaEmbeddingModelId } from 'ollama-ai-provider/src/ollama-embedding-settings'

import { buildProgram } from '../tools/command'

async function main(model: OllamaEmbeddingModelId) {
  const { embedding, usage } = await embed({
    model: ollama.embedding(model),
    value: 'sunny day at the beach',
  })

  console.log(embedding)
  console.log(usage)
}

buildProgram('nomic-embed-text', main).catch(console.error)
