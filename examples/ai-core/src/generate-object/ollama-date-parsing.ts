#! /usr/bin/env -S pnpm tsx

import { generateObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaChatModelId } from 'ollama-ai-provider/src/ollama-chat-settings'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: OllamaChatModelId) {
  const {
    object: { events },
  } = await generateObject({
    model: ollama(model),
    prompt: 'List 5 important events from the the year 2000.',
    schema: z.object({
      events: z.array(
        z.object({
          date: z
            .string()
            .describe('Format YYYY-MM-DD')
            .date()
            .transform((value) => new Date(value)),
          event: z.string(),
        }),
      ),
    }),
  })

  console.log(events)
}

buildProgram('llama3.1', main).catch(console.error)
