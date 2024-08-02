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
      {
        content: [
          { text: "What's the weather like today in Paris?", type: 'text' },
        ],
        role: 'user',
      },
      {
        content: [
          {
            args: {
              format: 'celsius',
              location: 'Paris, France',
            },
            toolCallId: '89a1e453-0bce-4de3-a456-c54bed09c520',
            toolName: 'get_current_weather',
            type: 'tool-call',
          },
        ],
        role: 'assistant',
      },
      {
        content: [
          {
            result: '22',
            toolCallId: '89a1e453-0bce-4de3-a456-c54bed09c520',
            toolName: 'get_current_weather',
            type: 'tool-result',
          },
        ],
        role: 'tool',
      },
      {
        content: [
          {
            text: 'The current temperature in Paris, France is 22 degrees Celsius.',
            type: 'text',
          },
        ],
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
      // Tool related messages based on: https://github.com/ollama/ollama/blob/f5e3939220e9cd3d7a636708bc9df031ebfd4854/server/testdata/tools/messages.json
      {
        content: "What's the weather like today in Paris?",
        role: 'user',
      },
      {
        content: '',
        role: 'assistant',
      },
      {
        content: '22',
        role: 'tool',
        tool_call_id: '89a1e453-0bce-4de3-a456-c54bed09c520',
      },
      {
        content:
          'The current temperature in Paris, France is 22 degrees Celsius.',
        role: 'assistant',
      },
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
