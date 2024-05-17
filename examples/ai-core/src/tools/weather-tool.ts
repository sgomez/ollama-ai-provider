import { z } from 'zod'

export const weatherTool = {
  description: 'Get the weather in a location',
  execute: async ({ location }: { location: string }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
}
