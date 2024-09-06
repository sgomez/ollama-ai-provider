#! /usr/bin/env -S pnpm tsx

import {
  experimental_wrapLanguageModel as wrapLanguageModel,
  generateText,
} from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'
import { yourCacheMiddleware } from './your-cache-middleware'

async function main(model: Parameters<typeof ollama>[0]) {
  const modelWithCaching = wrapLanguageModel({
    middleware: yourCacheMiddleware,
    model: ollama(model),
  })

  const start1 = Date.now()
  const result1 = await generateText({
    model: modelWithCaching,
    prompt: 'What cities are in the United States?',
  })

  const end1 = Date.now()

  const start2 = Date.now()
  const result2 = await generateText({
    model: modelWithCaching,
    prompt: 'What cities are in the United States?',
  })
  const end2 = Date.now()

  console.log(`Time taken for result1: ${end1 - start1}ms`)
  console.log(`Time taken for result2: ${end2 - start2}ms`)

  console.log(result1.text === result2.text)
}

buildProgram('llama3.1', main).catch(console.error)
