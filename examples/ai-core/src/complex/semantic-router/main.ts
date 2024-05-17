#! /usr/bin/env -S pnpm tsx

import { ollama } from 'ollama-ai-provider'
import { OllamaEmbeddingModelId } from 'ollama-ai-provider/src/ollama-embedding-settings'

import { buildProgram } from '../../tools/command'
import { SemanticRouter } from './semantic-router'

async function main(model: OllamaEmbeddingModelId) {
  const router = new SemanticRouter({
    embeddingModel: ollama.embedding(model),
    routes: [
      {
        name: 'sports' as const,
        values: [
          "who's your favorite football team?",
          'The World Cup is the most exciting event.',
          'I enjoy running marathons on weekends.',
        ],
      },
      {
        name: 'music' as const,
        values: [
          "what's your favorite genre of music?",
          'Classical music helps me concentrate.',
          'I recently attended a jazz festival.',
        ],
      },
    ],
    similarityThreshold: 0.2,
  })

  // topic is strongly typed
  const topic = await router.route(
    'Many consider Michael Jordan the greatest basketball player ever.',
  )

  switch (topic) {
    case 'sports': {
      console.log('sports')
      break
    }
    case 'music': {
      console.log('music')
      break
    }
    case null: {
      console.log('no topic found')
      break
    }
  }
}

buildProgram('nomic-embed-text', main).catch(console.error)
