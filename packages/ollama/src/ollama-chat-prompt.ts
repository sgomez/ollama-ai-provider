export type OllamaChatPrompt = Array<OllamaChatMessage>

export type OllamaChatMessage =
  | OllamaSystemMessage
  | OllamaUserMessage
  | OllamaAssistantMessage
  | OllamaToolMessage

export interface OllamaSystemMessage {
  content: string
  images?: Array<string>
  role: 'system'
}

export interface OllamaUserMessage {
  content: string
  images?: Array<string>
  role: 'user'
}

export interface OllamaAssistantMessage {
  content: string
  images?: Array<string>
  role: 'assistant'
  tool_calls?: Array<MessageToolCall>
}

export interface OllamaToolMessage {
  content: unknown
  role: 'tool'
  tool_call_id: string
}

export interface MessageToolCall {
  function: {
    arguments: string
    name: string
  }
  id: string
  type: 'function'
}
