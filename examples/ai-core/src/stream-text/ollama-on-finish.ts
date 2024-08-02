#! /usr/bin/env -S pnpm tsx
import { streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamText({
    model: ollama(model),
    onFinish({ finishReason, text, usage }) {
      console.log()
      console.log('onFinish')
      console.log('Token usage:', usage)
      console.log('Finish reason:', finishReason)
      console.log('Text:', text)
    },
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }
}

buildProgram('llama3.1', main).catch(console.error)
