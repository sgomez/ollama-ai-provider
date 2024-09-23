#! /usr/bin/env -S pnpm tsx

import {
  Experimental_LanguageModelV1Middleware as LanguageModelV1Middleware,
  experimental_wrapLanguageModel as wrapLanguageModel,
  generateText,
} from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

const logProviderMetadataMiddleware: LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    console.log(
      'providerMetadata: ' + JSON.stringify(params.providerMetadata, null, 2),
    )
    return params
  },
}

async function main(model: Parameters<typeof ollama>[0]) {
  const { text } = await generateText({
    experimental_providerMetadata: {
      myMiddleware: {
        example: 'value',
      },
    },
    model: wrapLanguageModel({
      middleware: logProviderMetadataMiddleware,
      model: ollama(model),
    }),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  console.log(text)
}

buildProgram('llama3.1', main).catch(console.error)
