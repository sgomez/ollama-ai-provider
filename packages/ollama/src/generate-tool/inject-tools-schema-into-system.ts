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
  tools,
}: {
  schemaPrefix?: string
  schemaSuffix?: string
  system: string
  tools?: LanguageModelV1FunctionTool[]
  // tools: JSONSchema7
}): string {
  if (!tools) {
    return system
  }

  return [
    system,
    system === null ? null : '', // add a newline if system is not null
    schemaPrefix,
    JSON.stringify(tools),
    schemaSuffix,
  ]
    .filter((line) => line !== null)
    .join('\n')
}
