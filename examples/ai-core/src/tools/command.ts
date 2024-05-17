import { Command } from 'commander'
import { ollama } from 'ollama-ai-provider'

export async function buildProgram(
  defaultModel:
    | Parameters<typeof ollama>[0]
    | Parameters<typeof ollama.embedding>[0],
  action: (model: string) => Promise<void>,
) {
  const program = new Command()

  program
    .option('-m, --model [model]', 'The model to be used', defaultModel)
    .action(async (options) => {
      await action(options.model)
    })

  program.parse()
}
