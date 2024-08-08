'use client'

import { generateId } from 'ai'
import { useActions, useUIState } from 'ai/rsc'
import { FormEventHandler, ReactElement } from 'react'

import { type AI } from '@/app/actions'
import { Message } from '@/components/message'

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
        display: <Message type="user">{value}</Message>,
        id: generateId(),
      },
    ])

    const responseMessage = await submitUserMessage(value)
    setMessages((currentMessages) => [...currentMessages, responseMessage])
  }
  return (
    <form
      className="flex flex-col gap-2 relative items-center"
      onSubmit={handleForm}
    >
      <input
        autoComplete="off"
        autoCorrect="off"
        autoFocus
        name="message"
        className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)]"
        placeholder={
          messages.length > 0
            ? 'Type a message...'
            : 'Type to start chatting...'
        }
        onChange={(event) => setInput(event.target.value)}
        tabIndex={0}
        value={input}
      />
    </form>
  )
}
