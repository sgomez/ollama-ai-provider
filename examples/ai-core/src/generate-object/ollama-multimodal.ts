import fs from 'node:fs'

import { generateObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaChatModelId } from 'ollama-ai-provider/src/ollama-chat-settings'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: OllamaChatModelId) {
  const { object } = await generateObject({
    messages: [
      {
        content: [
          { text: 'Describe the image in detail and review it', type: 'text' },
          { image: fs.readFileSync('./data/comic-cat.png'), type: 'image' },
        ],
        role: 'user',
      },
    ],
    model: ollama(model),
    schema: z.object({
      artwork: z.object({
        description: z.string(),
        review: z.string(),
        style: z.string(),
      }),
    }),
    system: 'You are an art critic reviewing a piece of art.',
  })

  console.log(JSON.stringify(object.artwork, null, 2))
}

buildProgram('llava:13b', main).catch(console.error)
