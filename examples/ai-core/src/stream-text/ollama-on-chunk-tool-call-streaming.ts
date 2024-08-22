#! /usr/bin/env -S pnpm tsx
import { streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'
import { weatherTool } from '../tools/weather-tool'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamText({
    experimental_toolCallStreaming: true,
    model: ollama(model),
    onChunk(chunk) {
      console.log('onChunk', chunk)
    },
    prompt: 'What is the weather in San Francisco?',
    tools: {
      cityAttractions: {
        parameters: z.object({ city: z.string() }),
      },
      weather: weatherTool,
    },
  })

  // consume stream:
  for await (const textPart of result.textStream) {
  }
}

buildProgram('llama3.1', main).catch(console.error)
