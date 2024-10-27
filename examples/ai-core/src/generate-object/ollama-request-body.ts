#! /usr/bin/env -S pnpm tsx

import { generateObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const { request } = await generateObject({
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

  console.log('REQUEST BODY')
  console.log(request.body)
}

buildProgram('llama3.1', main).catch(console.error)
