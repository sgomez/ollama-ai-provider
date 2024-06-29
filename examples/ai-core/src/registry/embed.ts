#! /usr/bin/env -S pnpm tsx

import { embed } from 'ai'
import { OllamaEmbeddingModelId } from 'ollama-ai-provider/src/ollama-embedding-settings'

import { buildProgram } from '../tools/command'
import { registry } from './setup-registry'

async function main(model: OllamaEmbeddingModelId) {
  const { embedding } = await embed({
    model: registry.textEmbeddingModel(model),
    value: 'sunny day at the beach',
  })

  console.log(embedding)
}

buildProgram('ollama:nomic-embed-text', main).catch(console.error)
