#! /usr/bin/env -S pnpm tsx

import { generateText, tool } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  await generateText({
    maxSteps: 5,
    model: ollama(model),
    onStepFinish: (step) => {
      console.log(JSON.stringify(step, null, 2))
    },
    prompt: 'What is the weather in my current location?',

    tools: {
      currentLocation: tool({
        description: 'Get the current location.',
        execute: async () => {
          const locations = ['New York', 'London', 'Paris']
          return {
            location: locations[Math.floor(Math.random() * locations.length)],
          }
        },
        parameters: z.object({}),
      }),
      weather: tool({
        description: 'Get the weather in a location',
        execute: async ({ location }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
      }),
    },
  })
}

buildProgram('qwen2.5', main).catch(console.error)
