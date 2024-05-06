import { LanguageModelV1Prompt } from '@ai-sdk/provider'

import { OllamaChatPrompt } from '@/ollama-chat-prompt'

export function convertToOllamaChatMessages(
  prompt: LanguageModelV1Prompt,
): OllamaChatPrompt {
  const messages: OllamaChatPrompt = []

  for (const { content, role } of prompt) {
    switch (role) {
      case 'system': {
        messages.push({ content, role: 'system' })
        break
      }

      case 'user': {
        messages.push({
          content: content
            .map((part) => {
              switch (part.type) {
                case 'text': {
                  return part.text
                }
              }
            })
            .join(''),
          role: 'user',
        })
        break
      }

      case 'assistant': {
        messages.push({
          content: content
            .map((part) => {
              switch (part.type) {
                case 'text': {
                  return part.text
                }
              }
            })
            .join(''),
          role: 'assistant',
        })
        break
      }

      default: {
        const _exhaustiveCheck: string = role
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`)
      }
    }
  }

  return messages
}
