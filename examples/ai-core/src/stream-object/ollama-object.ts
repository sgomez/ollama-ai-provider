#! /usr/bin/env -S pnpm tsx

import { streamObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = streamObject({
    model: ollama(model),
    prompt: 'Generate a lasagna recipe.',
    schema: z.object({
      recipe: z.object({
        ingredients: z.array(z.string()),
        name: z.string(),
        steps: z.array(z.string()),
      }),
    }),
  })

  result.object
    .then(({ recipe }) => {
      // do something with the fully typed, final object:
      console.log('Recipe:', JSON.stringify(recipe, null, 2))
    })
    .catch((error) => {
      // handle type validation failure
      // (when the object does not match the schema):
      console.error(error)
    })

  // note: the stream needs to be consumed because of backpressure
  for await (const partialObject of result.partialObjectStream) {
  }
}

buildProgram('llama3.1', main).catch(console.error)
