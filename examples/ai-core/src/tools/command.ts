import { Command } from 'commander'

export async function buildProgram(
  defaultModel: string,
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
