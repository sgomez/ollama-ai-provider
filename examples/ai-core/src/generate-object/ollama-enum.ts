#! /usr/bin/env -S pnpm tsx

import { generateObject } from 'ai'
import { ollama } from 'ollama-ai-provider'

import { buildProgram } from '../tools/command'

async function main(model: Parameters<typeof ollama>[0]) {
  const result = await generateObject({
    enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
    model: ollama(model),
    output: 'enum',
    prompt:
      'Classify the genre of this movie plot: ' +
      '"A group of astronauts travel through a wormhole in search of a ' +
      'new habitable planet for humanity."',
  })

  console.log(result.object)
  console.log()
  console.log('Token usage:', result.usage)
  console.log('Finish reason:', result.finishReason)
}

buildProgram('llama3.1', main).catch(console.error)
