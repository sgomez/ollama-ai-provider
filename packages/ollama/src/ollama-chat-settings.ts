export type OllamaChatModelId =
  | 'codellama'
  | 'codellama:7b'
  | 'codellama:13b'
  | 'codellama:34b'
  | 'codellama:70b'
  | 'codellama:code'
  | 'codellama:python'
  | 'falcon2'
  | 'falcon2:11b'
  | 'gemma'
  | 'gemma:2b'
  | 'gemma:7b'
  | 'gemma2'
  | 'gemma:9b'
  | 'gemma:27b'
  | 'llama2'
  | 'llama2:7b'
  | 'llama2:13b'
  | 'llama2:70b'
  | 'llama3'
  | 'llama3:8b'
  | 'llama3:70b'
  | 'llama3-chatqa'
  | 'llama3-chatqa:8b'
  | 'llama3-chatqa:70b'
  | 'llama3-gradient'
  | 'llama3-gradient:8b'
  | 'llama3-gradient:70b'
  | 'llava'
  | 'llava:7b'
  | 'llava:13b'
  | 'llava:34b'
  | 'llava-llama3'
  | 'llava-llama3:8b'
  | 'llava-phi3'
  | 'llava-phi3:3.8b'
  | 'mistral'
  | 'mistral:7b'
  | 'mixtral'
  | 'mixtral:8x7b'
  | 'mixtral:8x22b'
  | 'moondream'
  | 'moondream:1.8b'
  | 'openhermes'
  | 'openhermes:v2.5'
  | 'qwen'
  | 'qwen:7b'
  | 'qwen:14b'
  | 'qwen:32b'
  | 'qwen:72b'
  | 'qwen:110b'
  | 'qwen2'
  | 'qwen2:0.5b'
  | 'qwen2:1.5b'
  | 'qwen2:7b'
  | 'qwen2:72b'
  | 'phi3'
  | 'phi3:3.8b'
  | (string & NonNullable<unknown>)

export interface OllamaChatSettings {
  /**
   * Enable Mirostat sampling for controlling perplexity. (default: 0, 0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0)
   */
  mirostat?: 0 | 1 | 2

  /**
   * Influences how quickly the algorithm responds to feedback from the generated text. A lower learning rate will
   * result in slower adjustments, while a higher learning rate will make the algorithm more responsive. (Default: 0.1)
   */
  mirostatEta?: number

  /**
   * Controls the balance between coherence and diversity of the output. A lower value will result in more focused and
   * coherent text. (Default: 5.0)
   */
  mirostatTau?: number

  /**
   * Sets the size of the context window used to generate the next token. (Default: 2048)
   */
  numCtx?: number

  /**
   * Sets how far back for the model to look back to prevent repetition. (Default: 64, 0 = disabled, -1 = num_ctx)
   */
  repeatLastN?: number

  /**
   * Sets how strongly to penalize repetitions. A higher value (e.g., 1.5) will penalize repetitions more strongly
   * , while a lower value (e.g., 0.9) will be more lenient. (Default: 1.1)
   */
  repeatPenalty?: number

  /**
   * Sets the stop sequences to use. When this pattern is encountered the LLM will stop generating text and return.
   * Multiple stop patterns may be set by specifying multiple separate `stop` parameters in a modelfile.
   */
  stop?: string

  /**
   * Tail free sampling is used to reduce the impact of less probable tokens from the output. A higher value (e.g., 2.0)
   * will reduce the impact more, while a value of 1.0 disables this setting. (default: 1)
   */
  tfsZ?: number

  /**
   * Reduces the probability of generating nonsense. A higher value (e.g. 100) will give more diverse answers, while a
   * lower value (e.g. 10) will be more conservative. (Default: 40)
   */
  topK?: number
}
