'use client'

import { generateId } from 'ai'
import { useActions, useUIState } from 'ai/rsc'
import { MessageCircle, SendIcon } from 'lucide-react'
import { FormEventHandler, ReactElement } from 'react'

import { AI } from '@/app/actions'
import { UserMessage } from '@/components/chat/user-message'

export function Prompt({
  input,
  setInput,
}: {
  input: string
  setInput: (value: string) => void
}): ReactElement {
  const { submitUserMessage } = useActions<typeof AI>()
  const [messages, setMessages] = useUIState<typeof AI>()

  const handleForm: FormEventHandler = async (event) => {
    event.preventDefault()

    const value = input.trim()
    setInput('')
    if (!value) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        display: <UserMessage>{value}</UserMessage>,
        id: generateId(),
      },
    ])

    const responseMessage = await submitUserMessage(value)
    setMessages((currentMessages) => [...currentMessages, responseMessage])
  }
  return (
    <form onSubmit={handleForm}>
      <footer className="bg-muted py-4 px-6 flex items-center gap-2">
        <div className="flex items-center flex-grow gap-4 bg-gray-100 rounded-full">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={
              messages.length > 0
                ? 'Type a message...'
                : 'Type to start chatting...'
            }
            className="flex-grow h-8 px-2 bg-transparent border-none outline-none text-sm placeholder-gray-400 text-gray-600"
            autoComplete="off"
            autoCorrect="off"
            autoFocus
            name="message"
            onChange={(event) => setInput(event.target.value)}
            tabIndex={0}
            value={input}
          />
        </div>
        <button className="flex items-center justify-center w-8 h-8 ml-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
          <SendIcon className="w-5 h-5 text-white" />
        </button>
      </footer>
    </form>
  )
}
