import type { OllamaChatModelId } from '@/ollama-chat-settings'

export type OllamaEmbeddingModelId =
  | 'all-minilm'
  | 'all-minilm:22m'
  | 'all-minilm:33m'
  | 'mxbai-embed-large'
  | 'nomic-embed-text'
  | 'snowflake-arctic-embed'
  | 'snowflake-arctic-embed:22m'
  | 'snowflake-arctic-embed:33m'
  | 'snowflake-arctic-embed:110m'
  | 'snowflake-arctic-embed:137m'
  | 'snowflake-arctic-embed:335m'
  | OllamaChatModelId
  | (string & NonNullable<unknown>)

export interface OllamaEmbeddingSettings {
  maxEmbeddingsPerCall?: number
}
