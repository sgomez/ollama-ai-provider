#! /usr/bin/env -S pnpm tsx

import { jsonSchema, streamObject } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = streamObject({
    model: ollama(model),
    prompt: 'Generate a lasagna recipe.',
    schema: jsonSchema<{
      recipe: {
        ingredients: { amount: string; name: string }[]
        name: string
        steps: string[]
      }
    }>({
      properties: {
        recipe: {
          properties: {
            ingredients: {
              items: {
                properties: {
                  amount: { type: 'string' },
                  name: { type: 'string' },
                },
                required: ['name', 'amount'],
                type: 'object',
              },
              type: 'array',
            },
            name: { type: 'string' },
            steps: {
              items: { type: 'string' },
              type: 'array',
            },
          },
          required: ['name', 'ingredients', 'steps'],
          type: 'object',
        },
      },
      required: ['recipe'],
      type: 'object',
    }),
  })

  for await (const partialObject of result.partialObjectStream) {
    console.clear()
    console.log(JSON.stringify(partialObject, null, 2))
  }
}

buildProgram('llama3.1', main).catch(console.error)
