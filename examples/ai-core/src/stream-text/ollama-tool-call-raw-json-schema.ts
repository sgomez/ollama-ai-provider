#! /usr/bin/env -S pnpm tsx

import { jsonSchema, streamText, tool } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamText({
    model: ollama(model),
    prompt: 'What is the weather in San Francisco?',
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

  for await (const part of result.fullStream) {
    switch (part.type) {
      case 'text-delta': {
        console.log('Text delta:', part.textDelta)
        break
      }

      case 'tool-call': {
        switch (part.toolName) {
          case 'cityAttractions': {
            console.log('TOOL CALL cityAttractions')
            console.log(`city: ${part.args.city}`) // string
            break
          }

          case 'weather': {
            console.log('TOOL CALL weather')
            console.log(`location: ${part.args.location}`) // string
            break
          }
        }

        break
      }

      case 'tool-result': {
        switch (part.toolName) {
          // NOT AVAILABLE (NO EXECUTE METHOD)
          // case 'cityAttractions': {
          //   console.log('TOOL RESULT cityAttractions');
          //   console.log(`city: ${part.args.city}`); // string
          //   console.log(`result: ${part.result}`);
          //   break;
          // }

          case 'weather': {
            console.log('TOOL RESULT weather')
            console.log(`location: ${part.args.location}`) // string
            console.log(`temperature: ${part.result.temperature}`) // number
            break
          }
        }

        break
      }

      case 'finish': {
        console.log('Finish reason:', part.finishReason)
        console.log('Usage:', part.usage)
        break
      }

      case 'error': {
        console.error('Error:', part.error)
        break
      }
    }
  }
}

buildProgram('llama3.1', main).catch(console.error)
