#! /usr/bin/env -S pnpm tsx

import { generateObject, jsonSchema } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaChatModelId } from 'ollama-ai-provider/src/ollama-chat-settings'

import { buildProgram } from '../tools/command'

async function main(model: OllamaChatModelId) {
  const result = await generateObject({
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

  console.log(JSON.stringify(result.object.recipe, null, 2))
  console.log()
  console.log('Token usage:', result.usage)
  console.log('Finish reason:', result.finishReason)
}

buildProgram('llama3.1', main).catch(console.error)
