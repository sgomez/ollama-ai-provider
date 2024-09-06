import type { Experimental_LanguageModelV1Middleware as LanguageModelV1Middleware } from 'ai'

import { addToLastUserMessage } from './add-to-last-user-message'
import { getLastUserMessageText } from './get-last-user-message-text'

export const yourRagMiddleware: LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    const lastUserMessageText = getLastUserMessageText({
      prompt: params.prompt,
    })

    if (lastUserMessageText === undefined) {
      return params // do not use RAG (send unmodified parameters)
    }

    const instruction =
      'Use the following information to answer the question:\n' +
      findSources({ text: lastUserMessageText })
        .map((chunk) => JSON.stringify(chunk))
        .join('\n')

    return addToLastUserMessage({ params, text: instruction })
  },
}

// example, could implement anything here:
function findSources({ text }: { text: string }): Array<{
  previewText: string | undefined
  title: string
  url: string | undefined
}> {
  return [
    {
      previewText: 'New York is a city in the United States.',
      title: 'New York',
      url: 'https://en.wikipedia.org/wiki/New_York',
    },
    {
      previewText: 'San Francisco is a city in the United States.',
      title: 'San Francisco',
      url: 'https://en.wikipedia.org/wiki/San_Francisco',
    },
  ]
}
