'use client'

import { StreamableValue } from 'ai/rsc'
import { Bot } from 'lucide-react'

import { Avatar } from '@/components/ui/avatar'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'

export function BotStreamMessage({
  content,
}: {
  content: string | StreamableValue<string>
}) {
  const text = useStreamableText(content)

  return (
    <div className="flex items-start gap-4">
      <Avatar className="w-8 h-8">
        <Bot width={32} height={32} />
      </Avatar>
      <div className="bg-muted rounded-lg rounded-tl-none p-3 max-w-[75%]">
        {text}
      </div>
    </div>
  )
}
