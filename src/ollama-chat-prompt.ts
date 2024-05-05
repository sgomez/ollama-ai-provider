export type OllamaChatPrompt = Array<OllamaChatMessage>

export type OllamaChatMessage =
  | OllamaSystemMessage
  | OllamaUserMessage
  | OllamaAssistantMessage

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
}
