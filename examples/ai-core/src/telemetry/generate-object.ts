#! /usr/bin/env -S pnpm tsx

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'
import { generateObject } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { z } from 'zod'

import { buildProgram } from '../tools/command'

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
  traceExporter: new ConsoleSpanExporter(),
})

sdk.start()

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateObject({
    experimental_telemetry: {
      functionId: 'my-awesome-function',
      isEnabled: true,
      metadata: {
        someOtherThing: 'other-value',
        something: 'custom',
      },
    },
    model: ollama(model),
    prompt: 'Generate a lasagna recipe.',
    schema: z.object({
      recipe: z.object({
        ingredients: z.array(
          z.object({
            amount: z.string(),
            name: z.string(),
          }),
        ),
        name: z.string(),
        steps: z.array(z.string()),
      }),
    }),
  })

  console.log(JSON.stringify(result.object.recipe, null, 2))

  await sdk.shutdown()
}

buildProgram('llama3.1', main).catch(console.error)
