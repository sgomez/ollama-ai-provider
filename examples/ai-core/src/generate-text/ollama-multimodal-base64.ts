#! /usr/bin/env -S pnpm tsx

import fs from 'node:fs'

import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateText({
    maxTokens: 512,
    messages: [
      {
        content: [
          { text: 'Describe the image in detail.', type: 'text' },
          {
            image: fs.readFileSync('./data/comic-cat.png').toString('base64'),
            type: 'image',
          },
        ],
        role: 'user',
      },
    ],
    model: ollama(model),
  })

  console.log(result.text)
}

buildProgram('llava-llama3', main).catch(console.error)
