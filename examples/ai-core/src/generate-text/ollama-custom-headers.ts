#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

const ollama = createOllama({
  // fetch wrapper to log the headers:
  fetch: async (url, options) => {
    console.log('Headers', options?.headers)
    return fetch(url, options)
  },
  headers: {
    'custom-provider-header': 'value-1',
  },
})

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateText({
    headers: {
      'custom-request-header': 'value-2',
    },
    maxTokens: 50,
    model: ollama(model),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  console.log(result.text)
}

buildProgram('llama3', main).catch(console.error)
