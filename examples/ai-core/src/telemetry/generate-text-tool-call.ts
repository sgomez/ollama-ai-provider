#! /usr/bin/env -S pnpm tsx

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'
import { generateText, tool } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'
import { weatherTool } from '../tools/weather-tool'

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
    maxTokens: 512,
    model: ollama(model),
    prompt:
      'What is the weather in San Francisco and what attractions should I visit?',
    tools: {
      cityAttractions: tool({
        parameters: z.object({ city: z.string() }),
      }),
      weather: weatherTool,
    },
  })

  console.log(JSON.stringify(result, null, 2))

  await sdk.shutdown()
}

buildProgram('llama3.1', main).catch(console.error)
