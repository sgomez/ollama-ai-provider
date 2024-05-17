import {
  LanguageModelV1Prompt,
  UnsupportedFunctionalityError,
} from '@ai-sdk/provider'
import { convertUint8ArrayToBase64 } from '@ai-sdk/provider-utils'
import { describe, expect, it } from 'vitest'

import { convertToOllamaChatMessages } from '@/convert-to-ollama-chat-messages'

describe('convertToOllamaChatMessages', () => {
  it('should convert LanguageModelV1Prompt to OllamaChatPrompt', () => {
    // Arrange
    const prompt: LanguageModelV1Prompt = [
      { content: 'System message', role: 'system' },
      {
        content: [
          { text: 'User ', type: 'text' },
          { text: 'text ', type: 'text' },
          { text: 'message', type: 'text' },
          { image: new Uint8Array([0, 1, 2]), type: 'image' },
          { image: new Uint8Array([3, 4, 5]), type: 'image' },
        ],
        role: 'user',
      },
      {
        content: [{ text: 'Assistant text message', type: 'text' }],
        role: 'assistant',
      },
    ]

    // Act
    const result = convertToOllamaChatMessages(prompt)

    // Assert
    const expectedResult = [
      { content: 'System message', role: 'system' },
      {
        content: 'User text message',
        images: [
          convertUint8ArrayToBase64(new Uint8Array([0, 1, 2])),
          convertUint8ArrayToBase64(new Uint8Array([3, 4, 5])),
        ],
        role: 'user',
      },
      { content: 'Assistant text message', role: 'assistant' },
    ]
    expect(result).toEqual(expectedResult)
  })

  test('should throw UnsupportedFunctionalityError for image URL', () => {
    // Arrange
    const prompt: LanguageModelV1Prompt = [
      {
        content: [
          { image: new URL('https://example.com/image.png'), type: 'image' },
        ],
        role: 'user',
      },
    ]

    // Act
    const act = () => convertToOllamaChatMessages(prompt)

    // Assert
    expect(act).throws(UnsupportedFunctionalityError)
  })

  test('should throw Error for unsupported role', () => {
    // Arrange
    const prompt: LanguageModelV1Prompt = [
      // @ts-expect-error role checking
      { content: 'Invalid role message', role: 'invalid' },
    ]

    // Act
    const act = () => convertToOllamaChatMessages(prompt)

    // Assert
    expect(act).throws(Error, 'Unsupported role: invalid')
  })
})
