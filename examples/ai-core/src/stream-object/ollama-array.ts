#! /usr/bin/env -S pnpm tsx

import { streamObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const { elementStream: destinations } = await streamObject({
    model: ollama(model),
    output: 'array',
    prompt: 'What are the top 5 cities for short vacations in Europe?',
    schema: z.object({
      attractions: z.array(z.string()).describe('List of major attractions.'),
      city: z.string(),
      country: z.string(),
      description: z.string(),
    }),
  })

  for await (const destination of destinations) {
    console.log(destination) // destination is a complete array element
  }
}

buildProgram('llama3.1', main).catch(console.error)
