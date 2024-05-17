import { LanguageModelV1FinishReason } from '@ai-sdk/provider'

export function mapOllamaFinishReason(
  finishReason: string | null | undefined,
): LanguageModelV1FinishReason {
  switch (finishReason) {
    case 'stop':
    case 'tool-calls': {
      return finishReason
    }
    default: {
      return 'other'
    }
  }
}
