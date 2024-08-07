#! /usr/bin/env -S pnpm tsx

import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await ollama(model).doGenerate({
    inputFormat: 'prompt',
    mode: { type: 'regular' },
    prompt: [
      {
        content: [
          {
            text: 'Invent a new holiday and describe its traditions. Output as JSON object.',
            type: 'text',
          },
        ],
        role: 'user',
      },
    ],
    responseFormat: {
      schema: {
        properties: {
          text: { type: 'string' },
        },
        required: ['text'],
        type: 'object',
      },
      type: 'json',
    },
    temperature: 0,
  })

  console.log(result.text)
  console.log('WARNINGS:\n', JSON.stringify(result.warnings, null, 2))
}

buildProgram('llama3.1', main).catch(console.error)
