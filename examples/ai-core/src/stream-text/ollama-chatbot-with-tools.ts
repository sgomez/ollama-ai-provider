#! /usr/bin/env -S pnpm tsx

import * as readline from 'node:readline/promises'

import { CoreMessage, streamText, ToolCallPart, ToolResultPart } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'
import { weatherTool } from '../tools/weather-tool'

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const messages: CoreMessage[] = []

async function main(model: Parameters<typeof ollama>[0]) {
  let toolResponseAvailable = false

  while (true) {
    if (!toolResponseAvailable) {
      const userInput = await terminal.question('You: ')
      messages.push({ content: userInput, role: 'user' })
    }

    const result = await streamText({
      messages,
      model: ollama(model),
      system: `You are a helpful, respectful and honest assistant.`,
      tools: { weatherTool },
    })

    toolResponseAvailable = false
    let fullResponse = ''
    const toolCalls: ToolCallPart[] = []
    const toolResponses: ToolResultPart[] = []

    for await (const delta of result.fullStream) {
      switch (delta.type) {
        case 'text-delta': {
          if (fullResponse.length === 0) {
            process.stdout.write('\nAssistant: ')
          }

          fullResponse += delta.textDelta
          process.stdout.write(delta.textDelta)
          break
        }

        case 'tool-call': {
          toolCalls.push(delta)

          process.stdout.write(
            `\nTool call: '${delta.toolName}' ${JSON.stringify(delta.args)}`,
          )
          break
        }

        case 'tool-result': {
          toolResponses.push(delta)

          process.stdout.write(
            `\nTool response: '${delta.toolName}' ${JSON.stringify(
              delta.result,
            )}`,
          )
          break
        }
      }
    }
    process.stdout.write('\n\n')

    messages.push({
      content: [{ text: fullResponse, type: 'text' }, ...toolCalls],
      role: 'assistant',
    })

    if (toolResponses.length > 0) {
      messages.push({ content: toolResponses, role: 'tool' })
    }

    toolResponseAvailable = toolCalls.length > 0
  }
}
buildProgram('llama3.1', main).catch(console.error)
