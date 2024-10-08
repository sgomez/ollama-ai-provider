import { LanguageModelV1CallOptions } from 'ai'

export function addToLastUserMessage({
  params,
  text,
}: {
  params: LanguageModelV1CallOptions
  text: string
}): LanguageModelV1CallOptions {
  const { prompt, ...rest } = params

  const lastMessage = prompt.at(-1)

  if (lastMessage?.role !== 'user') {
    return params
  }

  return {
    ...rest,
    prompt: [
      ...prompt.slice(0, -1),
      {
        ...lastMessage,
        content: [{ text, type: 'text' }, ...lastMessage.content],
      },
    ],
  }
}
