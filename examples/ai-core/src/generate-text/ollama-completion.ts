#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaChatModelId } from 'ollama-ai-provider/src/ollama-chat-settings'

import { buildProgram } from '../tools/command'

async function main(model: OllamaChatModelId) {
  const result = await generateText({
    maxTokens: 1024,
    model: ollama(model),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  console.log(result.text)
}

buildProgram('llama3', main).catch(console.error)
