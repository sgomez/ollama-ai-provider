#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const { text, usage } = await generateText({
    abortSignal: AbortSignal.timeout(1000),
    model: ollama(model),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  console.log(text)
  console.log()
  console.log('Usage:', usage)
}

buildProgram('llama3.1', main).catch(console.error)
