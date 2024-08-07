#! /usr/bin/env -S pnpm tsx

import { generateText, jsonSchema, tool } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateText({
    maxTokens: 512,
    model: ollama(model),
    prompt:
      'What is the weather in San Francisco and what attractions should I visit?',
    tools: {
      cityAttractions: tool({
        parameters: jsonSchema<{ city: string }>({
          properties: {
            city: { type: 'string' },
          },
          required: ['city'],
          type: 'object',
        }),
      }),
      weather: tool({
        description: 'Get the weather in a location',
        // location below is inferred to be a string:
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
        parameters: jsonSchema<{ location: string }>({
          properties: {
            location: { type: 'string' },
          },
          required: ['location'],
          type: 'object',
        }),
      }),
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

buildProgram('llama3.1', main).catch(console.error)
