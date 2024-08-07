#! /usr/bin/env -S pnpm tsx

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'
import { generateText } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
  traceExporter: new ConsoleSpanExporter(),
})

sdk.start()

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateText({
    experimental_telemetry: {
      functionId: 'my-awesome-function',
      isEnabled: true,
      metadata: {
        someOtherThing: 'other-value',
        something: 'custom',
      },
    },
    maxTokens: 50,
    model: ollama(model),
    prompt: 'Invent a new holiday and describe its traditions.',
  })

  console.log(result.text)

  await sdk.shutdown()
}

buildProgram('llama3.1', main).catch(console.error)
