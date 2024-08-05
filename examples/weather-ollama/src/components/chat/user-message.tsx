import { UserRound } from 'lucide-react'
import { ReactNode } from 'react'

import { Avatar } from '@/components/ui/avatar'

export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-4 justify-end">
      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[75%]">
        {children}
      </div>
      <Avatar className="w-8 h-8">
        <UserRound width={24} height={24} />
      </Avatar>
    </div>
  )
}
