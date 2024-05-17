#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { OllamaChatModelId } from 'ollama-ai-provider/src/ollama-chat-settings'

import { buildProgram } from '../tools/command'

async function main(model: OllamaChatModelId) {
  const result = await generateText({
    maxTokens: 1024,
    messages: [
      {
        content: 'Hello!',
        role: 'user',
      },
      {
        content: 'Hello! How can I help you today?',
        role: 'assistant',
      },
      {
        content: 'I need help with my computer.',
        role: 'user',
      },
    ],
    model: ollama(model),
    system: 'You are a helpful chatbot.',
  })

  console.log(result.text)
}

buildProgram('llama3', main).catch(console.error)
