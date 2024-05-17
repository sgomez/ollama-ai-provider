#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateText({
    messages: [{ content: 'What is the capital of France?', role: 'user' }],
    model: ollama(model),
    system: 'You are a helpful assistant that answer in upper case.',
  })

  console.log(result.text)
}

buildProgram('llama3', main).catch(console.error)
