import { generateId } from '@ai-sdk/provider-utils'
import { z } from 'zod'

import type { OllamaChatResponseSchema } from '@/ollama-chat-language-model'

export function inferToolCallsFromResponse(
  response: OllamaChatResponseSchema,
): OllamaChatResponseSchema {
  try {
    const tool = JSON.parse(response.message.content)

    let parsedTools = toolResponseSchema.parse(tool)
    if (!Array.isArray(parsedTools)) {
      parsedTools = [parsedTools]
    }

    return {
      ...response,
      finish_reason: 'tool-calls',
      message: {
        content: '',
        role: 'assistant',
        tool_calls: parsedTools.map((parsedTool) => ({
          function: {
            arguments: parsedTool.arguments,
            name: parsedTool.name,
          },
          id: generateId(),
          type: 'function',
        })),
      },
    }
  } catch {
    return {
      ...response,
      finish_reason: 'stop',
    }
  }
}

const toolResponseSchema = z.union([
  z.array(
    z.object({
      arguments: z.record(z.unknown()),
      name: z.string(),
    }),
  ),
  z.object({
    arguments: z.record(z.unknown()),
    name: z.string(),
  }),
])
