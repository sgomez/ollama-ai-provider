import { LanguageModelV1FinishReason } from '@ai-sdk/provider'

export function mapOllamaFinishReason({
  finishReason,
  hasToolCalls,
}: {
  finishReason: string | null | undefined
  hasToolCalls: boolean
}): LanguageModelV1FinishReason {
  switch (finishReason) {
    case 'stop': {
      return hasToolCalls ? 'tool-calls' : 'stop'
    }
    default: {
      return 'other'
    }
  }
}
