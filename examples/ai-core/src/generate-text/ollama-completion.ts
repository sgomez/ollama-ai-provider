#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateText({
    maxTokens: 1024,
    model: ollama(model),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  console.log(result.text)
}

buildProgram('llama3', main).catch(console.error)
