#! /usr/bin/env -S pnpm tsx

import { generateObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaChatModelId } from 'ollama-ai-provider/src/ollama-chat-settings'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

console.log(
  'Probably object-tool is not working as expected with ollama tools, depends of the model capabilities',
)

async function main(model: OllamaChatModelId) {
  const result = await generateObject({
    maxTokens: 2000,
    mode: 'tool',
    model: ollama(model, { structuredOutputs: true }),
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

  console.log(JSON.stringify(result.object, null, 2))
}

buildProgram('llama3.1', main).catch(console.error)
