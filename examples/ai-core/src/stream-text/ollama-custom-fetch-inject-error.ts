#! /usr/bin/env -S pnpm tsx

import { streamText } from 'ai'
import { createOllama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

const ollama = createOllama({
  // example fetch wrapper that logs the URL:
  fetch: async (url, options) => {
    const result = await fetch(url, options)

    // Intercept the response stream
    const originalBody = result.body
    if (originalBody) {
      const reader = originalBody.getReader()
      let characterCount = 0

      const stream = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            characterCount += value.length
            controller.enqueue(value)

            if (characterCount > 1000) {
              controller.error(
                new Error('Injected error after 1000 characters'),
              )
              break
            }
          }
          controller.close()
        },
      })

      return new Response(stream, {
        headers: result.headers,
        status: result.status,
        statusText: result.statusText,
      })
    }

    return result
  },
})

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamText({
    model: ollama(model),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  for await (const part of result.fullStream) {
    process.stdout.write(JSON.stringify(part))
  }

  console.log()
  console.log('Token usage:', await result.usage)
  console.log('Finish reason:', await result.finishReason)
}

buildProgram('llama3.1', main).catch(console.error)
