import { generateObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaChatModelId } from 'ollama-ai-provider/src/ollama-chat-settings'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: OllamaChatModelId) {
  const result = await generateObject({
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

  console.log(JSON.stringify(result.object, null, 2))
}

buildProgram('openhermes', main).catch(console.error)
