#! /usr/bin/env -S pnpm tsx

import {
  experimental_wrapLanguageModel as wrapLanguageModel,
  streamText,
} from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'
import { yourRagMiddleware } from './your-rag-middleware'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await streamText({
    model: wrapLanguageModel({
      middleware: yourRagMiddleware,
      model: ollama(model),
    }),
    prompt: 'What cities are in the United States?',
  })

  for await (const textPart of result.textStream) {
    process.stdout.write(textPart)
  }
}

buildProgram('llama3.1', main).catch(console.error)
