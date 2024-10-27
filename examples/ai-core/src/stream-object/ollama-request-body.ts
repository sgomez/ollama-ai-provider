#! /usr/bin/env -S pnpm tsx

import { streamObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamObject({
    maxTokens: 2000,
    model: ollama(model),
    prompt:
      'Generate 3 character descriptions for a fantasy role playing game.',
    schema: z.object({
      characters: z.array(
        z.object({
          class: z
            .string()
            .describe('Character class, e.g. warrior, mage, or thief.'),
          description: z.string(),
          name: z.string(),
        }),
      ),
    }),
  })

  // consume stream
  for await (const part of result.partialObjectStream) {
  }

  console.log('REQUEST BODY')
  // eslint-disable-next-line unicorn/no-await-expression-member
  console.log((await result.request).body)
}

buildProgram('llama3.1', main).catch(console.error)
