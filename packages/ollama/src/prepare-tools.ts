import { LanguageModelV1, LanguageModelV1CallWarning } from '@ai-sdk/provider'

export function prepareTools({
  mode,
}: {
  mode: Parameters<LanguageModelV1['doGenerate']>[0]['mode'] & {
    type: 'regular'
  }
}): {
  tools:
    | undefined
    | {
        function: {
          description: string | undefined
          name: string
          parameters: unknown
        }
        type: 'function'
      }[]
  toolWarnings: LanguageModelV1CallWarning[]
} {
  const tools = mode.tools?.length ? mode.tools : undefined
  const toolWarnings: LanguageModelV1CallWarning[] = []

  const toolChoice = mode.toolChoice

  if (tools === undefined) {
    return {
      tools: undefined,
      toolWarnings,
    }
  }

  const ollamaTools: {
    function: {
      description: string | undefined
      name: string
      parameters: unknown
    }
    type: 'function'
  }[] = []

  for (const tool of tools) {
    if (tool.type === 'provider-defined') {
      toolWarnings.push({ tool, type: 'unsupported-tool' })
    } else {
      ollamaTools.push({
        function: {
          description: tool.description,
          name: tool.name,
          parameters: tool.parameters,
        },
        type: 'function',
      })
    }
  }

  if (toolChoice === undefined) {
    return {
      tools: ollamaTools,
      toolWarnings,
    }
  }

  const type = toolChoice.type

  switch (type) {
    case 'auto': {
      return {
        tools: ollamaTools,
        toolWarnings,
      }
    }
    case 'none': {
      return {
        tools: undefined,
        toolWarnings,
      }
    }
    default: {
      const _exhaustiveCheck: string = type
      throw new Error(`Unsupported tool choice type: ${_exhaustiveCheck}`)
    }
  }
}
