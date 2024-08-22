#! /usr/bin/env -S pnpm tsx

import { streamObject } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamObject({
    model: ollama(model),
    output: 'no-schema',
    prompt:
      'Generate 3 character descriptions for a fantasy role playing game.',
  })

  for await (const partialObject of result.partialObjectStream) {
    console.clear()
    console.log(partialObject)
  }
}

buildProgram('llama3.1', main).catch(console.error)
