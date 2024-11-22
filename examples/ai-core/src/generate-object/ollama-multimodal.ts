#! /usr/bin/env -S pnpm tsx

import fs from 'node:fs'

import { generateObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
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

buildProgram('llama3.2-vision', main).catch(console.error)
