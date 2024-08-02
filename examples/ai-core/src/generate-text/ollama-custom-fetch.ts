#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

const ollama = createOllama({
  // example fetch wrapper that logs the URL:
  fetch: async (url, options) => {
    console.log(`Fetching ${url}`)
    const result = await fetch(url, options)
    console.log(`Fetched ${url}`)
    console.log()
    return result
  },
})

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateText({
    model: ollama(model),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  console.log(result.text)
}

buildProgram('llama3.1', main).catch(console.error)
