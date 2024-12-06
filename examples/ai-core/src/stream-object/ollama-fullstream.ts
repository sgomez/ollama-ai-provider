#! /usr/bin/env -S pnpm tsx

import { streamObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = streamObject({
    maxTokens: 2000,
    mode: 'json',
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

  for await (const part of result.fullStream) {
    switch (part.type) {
      case 'object': {
        console.clear()
        console.log(part.object)
        break
      }

      case 'finish': {
        console.log('Finish reason:', part.finishReason)
        console.log('Usage:', part.usage)
        break
      }

      case 'error': {
        console.error('Error:', part.error)
        break
      }
    }
  }
}

buildProgram('llama3.1', main).catch(console.error)
