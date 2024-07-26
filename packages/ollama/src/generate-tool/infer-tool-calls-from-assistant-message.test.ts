import { describe, expect, it } from 'vitest'

import { inferToolCallsFromResponse } from '@/generate-tool/infer-tool-calls-from-response'
import { OllamaChatResponseSchema } from '@/ollama-chat-language-model'

describe('inferToolCallsFromAssistantMessage', () => {
  it('should infer valid selected tools response', () => {
    // Arrange
    const response = {
      finish_reason: 'stop',
      message: {
        content: JSON.stringify([
          { arguments: { numbers: [2, 3] }, name: 'sum' },
        ]),
        role: 'assistant',
      },
    } as OllamaChatResponseSchema

    // Act
    const parsedResponse = inferToolCallsFromResponse(response)

    // Assert
    expect(parsedResponse.finish_reason).toEqual('tool-calls')
    expect(parsedResponse.message.tool_calls).toContainEqual(
      expect.objectContaining({
        function: {
          arguments: { numbers: [2, 3] },
          name: 'sum',
        },
        id: expect.any(String),
        type: 'function',
      }),
    )
  })

  it('should infer valid selected tool response', () => {
    // Arrange
    const response = {
      finish_reason: 'stop',
      message: {
        content: JSON.stringify({
          arguments: { numbers: [2, 3] },
          name: 'sum',
        }),
        role: 'assistant',
      },
    } as OllamaChatResponseSchema

    // Act
    const parsedResponse = inferToolCallsFromResponse(response)

    // Assert
    expect(parsedResponse.finish_reason).toEqual('tool-calls')
    expect(parsedResponse.message.tool_calls).toContainEqual(
      expect.objectContaining({
        function: {
          arguments: { numbers: [2, 3] },
          name: 'sum',
        },
        id: expect.any(String),
        type: 'function',
      }),
    )
  })

  it('should ignore invalid tool calls', () => {
    // Arrange
    const response = {
      finish_reason: 'stop',
      message: {
        content: JSON.stringify([
          { arguments: { numbers: [2, 3] }, name: 'sum' },
        ]).slice(0, 10),
        role: 'assistant',
      },
    } as OllamaChatResponseSchema

    // Act
    const parsedResponse = inferToolCallsFromResponse(response)

    // Assert
    expect(parsedResponse).toEqual(response)
  })

  it('should set stop as finish reason if no tools was called', () => {
    // Arrange
    const response = {
      finish_reason: undefined,
      message: {
        content: JSON.stringify([
          { arguments: { numbers: [2, 3] }, name: 'sum' },
        ]).slice(0, 10),
        role: 'assistant',
      },
    } as OllamaChatResponseSchema

    // Act
    const parsedResponse = inferToolCallsFromResponse(response)

    // Assert
    expect(parsedResponse.finish_reason).toEqual('stop')
  })
})
