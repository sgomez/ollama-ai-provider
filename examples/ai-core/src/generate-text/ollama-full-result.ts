#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateText({
    model: ollama(model),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  console.log(JSON.stringify(result, null, 2))
}

buildProgram('llama3.1', main).catch(console.error)
