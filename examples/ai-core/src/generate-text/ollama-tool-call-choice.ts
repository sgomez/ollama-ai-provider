#! /usr/bin/env -S pnpm tsx

import { generateText, tool } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'
import { weatherTool } from '../tools/weather-tool'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateText({
    maxTokens: 512,
    model: ollama(model),
    prompt:
      'What is the weather in San Francisco and what attractions should I visit?',
    toolChoice: {
      toolName: 'weather',
      type: 'tool',
    },
    tools: {
      cityAttractions: tool({
        parameters: z.object({ city: z.string() }),
      }),
      weather: weatherTool,
    },
  })

  console.log(JSON.stringify(result, null, 2))
}

buildProgram('llama3.1', main).catch(console.error)
