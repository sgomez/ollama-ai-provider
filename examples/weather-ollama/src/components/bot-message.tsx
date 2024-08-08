'use client'

import { StreamableValue } from 'ai/rsc'

import { Message } from '@/components/message'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'

export function BotMessage({
  content,
}: {
  content: string | StreamableValue<string>
}) {
  const text = useStreamableText(content)

  return <Message type="assistant">{text}</Message>
}
