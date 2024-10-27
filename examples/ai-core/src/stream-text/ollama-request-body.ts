#! /usr/bin/env -S pnpm tsx

import { streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamText({
    maxRetries: 5,
    maxTokens: 512,
    model: ollama(model),
    prompt: 'Invent a new holiday and describe its traditions.',
    temperature: 0.3,
  })

  // consume stream
  for await (const textPart of result.textStream) {
  }

  console.log('REQUEST BODY')
  // eslint-disable-next-line unicorn/no-await-expression-member
  console.log((await result.request).body)
}

buildProgram('llama3.1', main).catch(console.error)
