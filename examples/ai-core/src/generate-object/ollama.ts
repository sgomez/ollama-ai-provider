#! /usr/bin/env -S pnpm tsx

import { generateObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateObject({
    model: ollama(model),
    prompt: 'Generate a lasagna recipe.',
    schema: z.object({
      recipe: z.object({
        ingredients: z.array(
          z.object({
            amount: z.string(),
            name: z.string(),
          }),
        ),
        name: z.string(),
        steps: z.array(z.string()),
      }),
    }),
  })

  console.log(JSON.stringify(result.object.recipe, null, 2))
  console.log()
  console.log('Token usage:', result.usage)
  console.log('Finish reason:', result.finishReason)
}

buildProgram('openhermes', main).catch(console.error)
