#! /usr/bin/env -S pnpm tsx

import * as readline from 'node:readline/promises'

import { CoreMessage, streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const messages: CoreMessage[] = []

async function main(model: Parameters<typeof ollama>[0]) {
  while (true) {
    const userInput = await terminal.question('You: ')

    messages.push({ content: userInput, role: 'user' })

    const result = await streamText({
      messages,
      model: ollama(model),
      system: `You are a helpful, respectful and honest assistant.`,
    })

    let fullResponse = ''
    process.stdout.write('\nAssistant: ')
    for await (const delta of result.textStream) {
      fullResponse += delta
      process.stdout.write(delta)
    }
    process.stdout.write('\n\n')

    messages.push({ content: fullResponse, role: 'assistant' })
  }
}

buildProgram('llama3.1', main).catch(console.error)
