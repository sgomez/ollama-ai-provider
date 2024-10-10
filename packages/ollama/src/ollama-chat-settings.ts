export type OllamaChatModelId =
  | 'codegemma'
  | 'codegemma:2b'
  | 'codegemma:7b'
  | 'codellama'
  | 'codellama:7b'
  | 'codellama:13b'
  | 'codellama:34b'
  | 'codellama:70b'
  | 'codellama:code'
  | 'codellama:python'
  | 'command-r'
  | 'command-r:35b'
  | 'command-r-plus'
  | 'command-r-plus:104b'
  | 'deepseek-coder-v2'
  | 'deepseek-coder-v2:16b'
  | 'deepseek-coder-v2:236b'
  | 'falcon2'
  | 'falcon2:11b'
  | 'firefunction-v2'
  | 'firefunction-v2:70b'
  | 'gemma'
  | 'gemma:2b'
  | 'gemma:7b'
  | 'gemma2'
  | 'gemma2:2b'
  | 'gemma2:9b'
  | 'gemma2:27b'
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
  | 'llama3.1'
  | 'llama3.1:8b'
  | 'llama3.1:70b'
  | 'llama3.1:405b'
  | 'llama3.2'
  | 'llama3.2:1b'
  | 'llama3.2:3b'
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
  | 'mistral-large'
  | 'mistral-large:123b'
  | 'mistral-nemo'
  | 'mistral-nemo:12b'
  | 'mistral-small'
  | 'mistral-small:22b'
  | 'mixtral'
  | 'mixtral:8x7b'
  | 'mixtral:8x22b'
  | 'moondream'
  | 'moondream:1.8b'
  | 'openhermes'
  | 'openhermes:v2.5'
  | 'nemotron-mini'
  | 'nemotron-mini:4b'
  | 'phi3'
  | 'phi3:3.8b'
  | 'phi3:14b'
  | 'phi3.5'
  | 'phi3.5:3.8b'
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
  | 'qwen2.5'
  | 'qwen2.5:0.5b'
  | 'qwen2.5:1.5b'
  | 'qwen2.5:3b'
  | 'qwen2.5:7b'
  | 'qwen2.5:14b'
  | 'qwen2.5:32b'
  | 'qwen2.5:72b'
  | 'qwen2.5-coder'
  | 'qwen2.5-coder:1.5b'
  | 'qwen2.5-coder:7b'
  | 'smollm'
  | 'smollm:135m'
  | 'smollm:360m'
  | 'smollm:1.7b'
  | (string & NonNullable<unknown>)

export interface OllamaChatSettings {
  /**
   * Until Ollama officially supports tool calling in streams, the provider can try to detect function calls. Enabled by
   * default to maintain backward compatibility, disable it if you encounter any issues.
   */
  experimentalStreamTools?: boolean

  /**
   * Enables the use of half-precision floating point values for key-value memory. This helps in optimizing memory usage. (Default: true)
   */
  f16Kv?: boolean

  /**
   * If set to true, reduces the VRAM usage by trading off speed for memory. (Default: false)
   */
  lowVram?: boolean

  /**
   * Sets which GPU is the main one.
   */
  mainGpu?: number

  /**
   * Minimum cumulative probability for tokens to be considered. (Default: 0.0)
   */
  minP?: number

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
   * Controls whether to use Non-Uniform Memory Access (NUMA) for more efficient memory management. (Default: false)
   */
  numa?: boolean

  /**
   * Sets the number of batches to be processed. (Default: 512)
   */
  numBatch?: number

  /**
   * Sets the size of the context window used to generate the next token. (Default: 2048)
   */
  numCtx?: number

  /**
   * Controls the number of GPUs to use for the operation. (Default: -1, indicates that NumGPU should be set dynamically)
   */
  numGpu?: number

  /**
   * Keeps a number of tokens from the context. Controls how many of the previous tokens are retained. (Default: 4)
   */
  numKeep?: number

  /**
   * Controls the number of tokens to predict in a single generation. (Default: -1)
   */
  numPredict?: number

  /**
   * Sets the number of CPU threads to use. (Default: 0, indicates let the runtime decide)
   */
  numThread?: number

  /**
   * Penalizes the model for generating newline characters. If set to true, it discourages the model from generating too many newlines. (Default: true)
   */
  penalizeNewline?: boolean

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
   *
   * @deprecated Use `stopSequences` from AI SDK functions.
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
   *
   * @deprecated Use `topK` from AI SDK functions.
   */
  topK?: number

  /**
   * Controls the "typical" sampling probability. (Default: 1.0)
   */
  typicalP?: number

  /**
   * Locks the memory to prevent swapping, which can be useful for performance optimization. (Default: false)
   */
  useMlock?: boolean

  /**
   * Enables memory mapping to reduce RAM usage. (Default: false)
   */
  useMmap?: boolean

  /**
   * If true, the model will only load the vocabulary without performing further computation. (Default: false)
   */
  vocabOnly?: boolean
}
