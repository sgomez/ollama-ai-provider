#! /usr/bin/env -S pnpm tsx

import { streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'
import { registry } from './setup-registry'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamText({
    model: registry.languageModel(model),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }
}

buildProgram('ollama:llama3', main).catch(console.error)
