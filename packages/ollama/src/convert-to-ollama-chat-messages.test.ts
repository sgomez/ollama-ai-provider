import {
  LanguageModelV1Prompt,
  UnsupportedFunctionalityError,
} from '@ai-sdk/provider'
import { describe, expect, it } from 'vitest'

import { convertToOllamaChatMessages } from '@/convert-to-ollama-chat-messages'

describe('system messages', () => {
  it('should convert messages with only a text part to a string content', async () => {
    const result = convertToOllamaChatMessages([
      {
        content: 'You are a bot',
        role: 'system',
      },
    ])

    expect(result).toEqual([{ content: 'You are a bot', role: 'system' }])
  })
})

describe('assistant messages', () => {
  it('should convert messages with only a text part to a string content', async () => {
    const result = convertToOllamaChatMessages([
      {
        content: [{ text: 'Hello', type: 'text' }],
        role: 'assistant',
      },
    ])

    expect(result).toEqual([{ content: 'Hello', role: 'assistant' }])
  })
})

describe('user messages', () => {
  it('should convert messages with image parts to multiple parts', async () => {
    const result = convertToOllamaChatMessages([
      {
        content: [
          { text: 'Hello', type: 'text' },
          {
            image: new Uint8Array([0, 1, 2, 3]),
            mimeType: 'image/png',
            type: 'image',
          },
        ],
        role: 'user',
      },
    ])

    expect(result).toEqual([
      {
        content: 'Hello',
        images: ['AAECAw=='],
        role: 'user',
      },
    ])
  })

  it('should convert messages with only a text part to a string content', async () => {
    const result = convertToOllamaChatMessages([
      {
        content: [{ text: 'Hello', type: 'text' }],
        role: 'user',
      },
    ])

    expect(result).toEqual([{ content: 'Hello', role: 'user' }])
  })

  it('should throw UnsupportedFunctionalityError for image URL', () => {
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

  it('should throw Error for unsupported role', () => {
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

describe('tool calls', () => {
  it('should generate ollama tool calls messages', () => {
    const result = convertToOllamaChatMessages([
      // Tool related messages based on: https://github.com/ollama/ollama/blob/f5e3939220e9cd3d7a636708bc9df031ebfd4854/server/testdata/tools/messages.json
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
            result: { location: 'Paris, France', temperature: 22 },
            toolCallId: '89a1e453-0bce-4de3-a456-c54bed09c520',
            toolName: 'get_current_weather',
            type: 'tool-result',
          },
        ],
        role: 'tool',
      },
    ])

    expect(result).toEqual([
      {
        content: '',
        role: 'assistant',
        tool_calls: [
          {
            function: {
              arguments: {
                format: 'celsius',
                location: 'Paris, France',
              },
              name: 'get_current_weather',
            },
            id: '89a1e453-0bce-4de3-a456-c54bed09c520',
            type: 'function',
          },
        ],
      },
      {
        content: JSON.stringify({ location: 'Paris, France', temperature: 22 }),
        role: 'tool',
        tool_call_id: '89a1e453-0bce-4de3-a456-c54bed09c520',
      },
    ])
  })
})
