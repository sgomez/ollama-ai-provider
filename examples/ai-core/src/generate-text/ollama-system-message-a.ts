#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateText({
    messages: [
      {
        content: 'You are a helpful assistant that answer in upper case.',
        role: 'system',
      },
      { content: 'What is the capital of France?', role: 'user' },
    ],
    model: ollama(model),
  })

  console.log(result.text)
}

buildProgram('llama3.1', main).catch(console.error)
