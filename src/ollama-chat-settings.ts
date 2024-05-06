export type OllamaChatModelId =
  | 'llama2'
  | 'llama2:7b'
  | 'llama2:13b'
  | 'llama2:70b'
  | 'llama3'
  | 'llama3:8b'
  | 'llama3:70b'
  | 'llava'
  | 'llava:7b'
  | 'llava:13b'
  | 'llava:34b'
  | 'mistral'
  | 'mistral:7b'
  | 'mixtral'
  | 'mixtral:8x7b'
  | 'mixtral:8x22b'
  | 'openhermes'
  | 'openhermes:v2.5'
  | 'phi3'
  | 'phi3:3.8b'
  | (string & NonNullable<unknown>)

export interface OllamaChatSettings {}
