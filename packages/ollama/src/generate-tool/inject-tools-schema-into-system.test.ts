import { LanguageModelV1FunctionTool } from '@ai-sdk/provider'
import { describe, expect, it } from 'vitest'

import { injectToolsSchemaIntoSystem } from '@/generate-tool/inject-tools-schema-into-system'

describe('injectToolsSchemaIntoSystem', () => {
  it('should return system message if no tools are present', () => {
    // Arrange
    const system = 'You are a helpful and honest assistant.'

    // Act
    const systemWithTools = injectToolsSchemaIntoSystem({ system })

    // Assert
    expect(systemWithTools).toEqual(system)
  })

  it('should return system message with tools', () => {
    // Arrange
    const system = 'You are a helpful and honest assistant.'
    const tools: LanguageModelV1FunctionTool[] = [
      {
        description: 'Sum numbers',
        name: 'sum',
        parameters: { type: 'object' },
        type: 'function',
      },
      {
        description: 'Multiply numbers',
        name: 'multiply',
        parameters: { type: 'object' },
        type: 'function',
      },
    ]

    // Act
    const systemWithTools = injectToolsSchemaIntoSystem({ system, tools })

    // Assert
    expect(systemWithTools).toMatch(/You are a helpful and honest assistant./)
    expect(systemWithTools).toMatch(/You have access to the following tools:/)
    expect(systemWithTools).toMatch(/"name":"sum"/)
    expect(systemWithTools).toMatch(/"name":"multiply"/)
  })

  it('should return system message with choiced tool', () => {
    // Arrange
    const system = 'You are a helpful and honest assistant.'
    const tools: LanguageModelV1FunctionTool[] = [
      {
        description: 'Sum numbers',
        name: 'sum',
        parameters: { type: 'object' },
        type: 'function',
      },
      {
        description: 'Multiply numbers',
        name: 'multiply',
        parameters: { type: 'object' },
        type: 'function',
      },
    ]
    const toolChoice = 'sum'

    // Act
    const systemWithTools = injectToolsSchemaIntoSystem({
      system,
      toolChoice,
      tools,
    })

    // Assert
    expect(systemWithTools).toMatch(/You are a helpful and honest assistant./)
    expect(systemWithTools).toMatch(/You have access to the following tools:/)
    expect(systemWithTools).toMatch(/"name":"sum"/)
    expect(systemWithTools).not.toMatch(/"name":"multiply"/)
  })
})
