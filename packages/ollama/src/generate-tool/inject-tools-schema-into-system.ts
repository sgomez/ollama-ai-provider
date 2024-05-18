import { LanguageModelV1FunctionTool } from '@ai-sdk/provider'

const DEFAULT_SCHEMA_PREFIX = 'You have access to the following tools:'
const DEFAULT_SCHEMA_SUFFIX = `To use a tool, you MUST answer with a JSON object with the following structure:
[
  {
    "name": <name of the called tool>,
    "arguments": <arguments for the tool matching the above JSON schema>
  }
]`

export function injectToolsSchemaIntoSystem({
  schemaPrefix = DEFAULT_SCHEMA_PREFIX,
  schemaSuffix = DEFAULT_SCHEMA_SUFFIX,
  system,
  toolChoice,
  tools,
}: {
  schemaPrefix?: string
  schemaSuffix?: string
  system: string
  toolChoice?: string
  tools?: LanguageModelV1FunctionTool[]
}): string {
  const selectedTools = tools?.filter(
    (tool) => !toolChoice || tool.name === toolChoice,
  )

  if (!selectedTools) {
    return system
  }

  return [system, schemaPrefix, JSON.stringify(selectedTools), schemaSuffix]
    .filter((line) => line !== null)
    .join('\n')
}
