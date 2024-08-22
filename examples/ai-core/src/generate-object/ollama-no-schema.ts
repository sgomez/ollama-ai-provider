#! /usr/bin/env -S pnpm tsx

import { generateObject } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateObject({
    model: ollama(model),
    output: 'no-schema',
    prompt: 'Generate a lasagna recipe.',
  })

  console.log(JSON.stringify(result.object, null, 2))
  console.log()
  console.log('Token usage:', result.usage)
  console.log('Finish reason:', result.finishReason)
}

buildProgram('llama3.1', main).catch(console.error)
