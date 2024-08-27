#! /usr/bin/env -S pnpm tsx

import fs from 'node:fs'

import { streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'
import { registry } from './setup-registry'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamText({
    maxTokens: 512,
    messages: [
      {
        content: [
          { text: 'Describe the image in detail.', type: 'text' },
          { image: fs.readFileSync('./data/comic-cat.png'), type: 'image' },
        ],
        role: 'user',
      },
    ],
    model: registry.languageModel(model),
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }
}

buildProgram('ollama:multimodal', main).catch(console.error)
