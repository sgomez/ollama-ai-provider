import { Command } from 'commander'
import { OllamaChatModelId } from 'ollama-ai-provider/src/ollama-chat-settings'
import { OllamaEmbeddingModelId } from 'ollama-ai-provider/src/ollama-embedding-settings'

export async function buildProgram(
  defaultModel: OllamaChatModelId | OllamaEmbeddingModelId,
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
