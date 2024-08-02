#! /usr/bin/env -S pnpm tsx

import { streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  try {
    const { textStream } = await streamText({
      abortSignal: AbortSignal.timeout(3000),
      model: ollama(model),
      prompt: 'Write a short story about a robot learning to love:\n\n',
    })

    for await (const textPart of textStream) {
      process.stdout.write(textPart)
    }
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === 'AbortError' || error.name === 'TimeoutError')
    ) {
      console.log('\n\nAbortError: The run was aborted.')
    }
  }
}

buildProgram('llama3.1', main).catch(console.error)
