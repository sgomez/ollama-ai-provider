'use server'

import { CoreMessage, generateId } from 'ai'
import { createAI } from 'ai/rsc'
import { ReactNode } from 'react'

import { submitUserMessage } from '@/lib/ai/actions'

export type Message = CoreMessage & {
  id: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  display: ReactNode
  id: string
}[]

export type UIActions = {
  submitUserMessage: typeof submitUserMessage
}

export const AI = createAI<AIState, UIState, UIActions>({
  actions: {
    submitUserMessage,
  },
  initialAIState: { chatId: generateId(), messages: [] },
  initialUIState: [],
})
