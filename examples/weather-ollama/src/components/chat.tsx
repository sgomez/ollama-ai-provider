'use client'

import { useUIState } from 'ai/rsc'
import { Bot } from 'lucide-react'
import { useState } from 'react'

import { AI } from '@/app/actions'
import { ListMessages } from '@/components/chat/list-messages'
import { Prompt } from '@/components/chat/prompt'
import { Avatar } from '@/components/ui/avatar'

export function Chat() {
  const [messages] = useUIState<typeof AI>()
  const [input, setInput] = useState('')

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <Bot width={32} height={32} />
          </Avatar>
          <h1 className="text-lg font-medium">Chatbot</h1>
        </div>
      </header>
      <ListMessages messages={messages} />
      <Prompt input={input} setInput={setInput} />
    </div>
  )
}
