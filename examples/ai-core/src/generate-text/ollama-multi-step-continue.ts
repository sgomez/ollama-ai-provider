#! /usr/bin/env -S pnpm tsx

import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const { steps, text, usage } = await generateText({
    experimental_continueSteps: true, // 4096 output tokens
    maxSteps: 5,
    model: ollama(model),
    prompt:
      'Write a book about Roman history, ' +
      'from the founding of the city of Rome ' +
      'to the fall of the Western Roman Empire. ' +
      'Each chapter MUST HAVE at least 1000 words.',
  })

  console.log(text)
  console.log()
  console.log('Usage:', usage)
  console.log('# of steps:', steps.length)
}

buildProgram('qwen2.5', main).catch(console.error)
