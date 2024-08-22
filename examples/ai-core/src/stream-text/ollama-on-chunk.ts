#! /usr/bin/env -S pnpm tsx
import { streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamText({
    model: ollama(model),
    onChunk({ chunk }) {
      console.log('onChunk', chunk)
    },
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  // consume stream:
  for await (const textPart of result.textStream) {
  }
}

buildProgram('llama3.1', main).catch(console.error)
