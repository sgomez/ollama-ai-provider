import { Bot } from 'lucide-react'
import { ReactNode } from 'react'

import { Avatar } from '@/components/ui/avatar'

export function BotMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <Avatar className="w-8 h-8">
        <Bot width={32} height={32} />
      </Avatar>
      <div className="bg-muted rounded-lg p-3 max-w-[75%]">{children}</div>
    </div>
  )
}
