#! /usr/bin/env -S pnpm tsx
import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaChatModelId } from 'ollama-ai-provider/src/ollama-chat-settings'

import { buildProgram } from '../tools/command'

async function main(model: OllamaChatModelId) {
  const result = await generateText({
    messages: [{ content: 'What is the capital of France?', role: 'user' }],
    model: ollama(model),
    system: 'You are a helpful assistant that answer in upper case.',
  })

  console.log(result.text)
}

buildProgram('llama3', main).catch(console.error)
