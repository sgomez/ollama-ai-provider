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
    tools: {
      cityAttractions: tool({
        parameters: z.object({ city: z.string() }),
      }),
      weather: weatherTool,
    },
  })

  // typed tool calls:
  for (const toolCall of result.toolCalls) {
    switch (toolCall.toolName) {
      case 'cityAttractions': {
        toolCall.args.city // string
        break
      }

      case 'weather': {
        toolCall.args.location // string
        break
      }
    }
  }

  // typed tool results for tools with execute method:
  for (const toolResult of result.toolResults) {
    switch (toolResult.toolName) {
      // NOT AVAILABLE (NO EXECUTE METHOD)
      // case 'cityAttractions': {
      //   toolResult.args.city; // string
      //   toolResult.result;
      //   break;
      // }

      case 'weather': {
        toolResult.args.location // string
        toolResult.result.location // string
        toolResult.result.temperature // number
        break
      }
    }
  }

  console.log(JSON.stringify(result, null, 2))
}

buildProgram('openhermes', main).catch(console.error)
