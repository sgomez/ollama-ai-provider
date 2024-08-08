'use server'

import { generateId } from 'ai'
import { createStreamableValue, getMutableAIState, streamUI } from 'ai/rsc'
import { Loader } from 'lucide-react'
import { ollama } from 'ollama-ai-provider'
import OpenWeatherAPI from 'openweather-api-node'
import { ReactNode } from 'react'
import { z } from 'zod'

import { AI } from '@/app/actions'
import { BotMessage } from '@/components/bot-message'
import { Message } from '@/components/message'
import { WeatherMessage } from '@/components/weather-message'

const PROMPT = `You are a helpful assistant specialized in weather-related information.

- General Interaction: Start with a friendly greeting and explain what are you do. Maintain a polite and approachable tone throughout the conversation. If the user asks about topics outside of weather, politely remind them that your expertise is limited to weather-related queries.

- Contextual Awareness: ONLY use the 'showWeatherInformation' tool when the user specifically asks for weather in a location. If the user doesn't mention a location, kindly ask them to provide the city or region but never call the tool.

- Weather-Focused: Gently guide the conversation back to relevant weather topics if it deviates. If the user greets you or asks a general question, respond appropriately without providing weather details unless specifically requested.
`

export async function submitUserMessage(content: string): Promise<{
  display: ReactNode
  id: string
}> {
  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        content,
        id: generateId(),
        role: 'user',
      },
    ],
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | ReactNode

  const result = await streamUI({
    initial: (
      <Message type="assistant">
        <Loader className="animate-spin" />
      </Message>
    ),
    maxRetries: 5,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: aiState.get().messages.map((message: any) => ({
      content: message.content,
      name: message.name,
      role: message.role,
    })),
    model: ollama('llama3.1'),
    system: PROMPT,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    text: ({ content, delta, done }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              content,
              id: generateId(),
              role: 'assistant',
            },
          ],
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    tools: {
      showWeatherInformation: {
        description: 'Show weather information',
        generate: async function* ({ latitude, location, longitude }) {
          yield (
            <Message type="assistant">
              <Loader className="animate-spin" />
            </Message>
          )

          const openWeatherApiKey = process.env.OPENWEATHER_API_KEY ?? ''

          const openWeather = new OpenWeatherAPI({
            coordinates: { lat: latitude, lon: longitude },
            key: openWeatherApiKey,
            units: 'metric',
          })

          const current = await openWeather.getCurrent()

          return (
            <WeatherMessage location={location} current={current.weather} />
          )
        },
        parameters: z.object({
          latitude: z
            .number()
            .describe(
              'Latitude of the city. You must provide this information',
            ),
          location: z.string().describe('Name of the city to show the weather'),
          longitude: z
            .number()
            .describe(
              'Longitude of the city. You must provide this information',
            ),
        }),
      },
    },
  })

  return {
    display: result.value,
    id: generateId(),
  }
}
