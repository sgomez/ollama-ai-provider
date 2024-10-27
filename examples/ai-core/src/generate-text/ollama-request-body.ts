#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const { request } = await generateText({
    model: ollama(model),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  console.log('REQUEST BODY')
  console.log(request.body)
}

buildProgram('llama3.1', main).catch(console.error)
