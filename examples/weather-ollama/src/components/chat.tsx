'use client'

import { useUIState } from 'ai/rsc'
import { useState } from 'react'

import { AI } from '@/app/actions'
import { Container } from '@/components/container'
import { ListMessages } from '@/components/list-messages'
import { Prompt } from '@/components/prompt'

export function Chat() {
  const [messages] = useUIState<typeof AI>()
  const [input, setInput] = useState('')

  return (
    <Container>
      <ListMessages messages={messages} />
      <Prompt input={input} setInput={setInput} />
    </Container>
  )
}
