import type {
  LanguageModelV1CallOptions,
  LanguageModelV1FinishReason,
  LanguageModelV1FunctionTool,
  LanguageModelV1StreamPart,
} from '@ai-sdk/provider'
import { generateId } from '@ai-sdk/provider-utils'
import { parse } from 'partial-json'

type ToolCall = {
  function: {
    arguments: string
    name: string
  }
  id: string
  type: 'function'
}

export type CallModeType = LanguageModelV1CallOptions['mode']['type']

export class InferToolCallsFromStream {
  private _firstMessage: boolean
  private readonly _toolCalls: ToolCall[]
  private _tools?: LanguageModelV1FunctionTool[]
  private _toolPartial: string
  private readonly _type: CallModeType
  private _detectedToolCall: boolean

  constructor({
    tools,
    type,
  }: {
    tools: LanguageModelV1FunctionTool[] | undefined
    type: CallModeType
  }) {
    this._firstMessage = true
    this._tools = tools
    this._toolPartial = ''
    this._toolCalls = []
    this._type = type
    this._detectedToolCall = false
  }

  get toolCalls(): ToolCall[] {
    return this._toolCalls
  }

  get detectedToolCall(): boolean {
    return this._detectedToolCall
  }

  parse({
    controller,
    delta,
  }: {
    controller: TransformStreamDefaultController<LanguageModelV1StreamPart>
    delta: string
  }): boolean {
    this.detectToolCall(delta)

    if (!this._detectedToolCall) {
      return false
    }

    this._toolPartial += delta

    let parsedFunctions = parse(this._toolPartial)
    if (!Array.isArray(parsedFunctions)) {
      parsedFunctions = [parsedFunctions]
    }

    for (const [index, parsedFunction] of parsedFunctions.entries()) {
      const parsedArguments = JSON.stringify(parsedFunction?.parameters) ?? ''

      if (parsedArguments === '') {
        continue
      }

      if (!this._toolCalls[index]) {
        this._toolCalls[index] = {
          function: {
            arguments: '',
            name: parsedFunction.name,
          },
          id: generateId(),
          type: 'function',
        }
      }

      const toolCall = this._toolCalls[index]
      toolCall.function.arguments = parsedArguments

      controller.enqueue({
        argsTextDelta: delta,
        toolCallId: toolCall.id,
        toolCallType: 'function',
        toolName: toolCall.function.name,
        type: 'tool-call-delta',
      })
    }

    return true
  }

  finish({
    controller,
  }: {
    controller: TransformStreamDefaultController<LanguageModelV1StreamPart>
  }): LanguageModelV1FinishReason {
    for (const toolCall of this.toolCalls) {
      controller.enqueue({
        args: toolCall.function.arguments,
        toolCallId: toolCall.id,
        toolCallType: 'function',
        toolName: toolCall.function.name,
        type: 'tool-call',
      })
    }

    return this.finishReason()
  }

  private detectToolCall(delta: string) {
    if (!this._tools || this._tools.length === 0) {
      return false
    }

    if (this._firstMessage) {
      if (this._type === 'object-tool') {
        this._detectedToolCall = true
      } else if (
        this._type === 'regular' &&
        (delta.trim().startsWith('{') || delta.trim().startsWith('['))
      ) {
        this._detectedToolCall = true
      }

      this._firstMessage = false
    }
  }

  private finishReason(): LanguageModelV1FinishReason {
    if (!this.detectedToolCall) {
      return 'stop'
    }

    return this._type === 'object-tool' ? 'stop' : 'tool-calls'
  }
}
