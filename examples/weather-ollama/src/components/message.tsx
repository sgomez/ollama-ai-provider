'use client'

import { Bot, User } from 'lucide-react'
import { ReactNode } from 'react'

export function Message({
  children,
  type,
}: {
  children: ReactNode
  type: 'user' | 'assistant'
}) {
  return (
    <>
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        {type === 'user' ? <User /> : <Bot />}
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4 whitespace-pre-wrap">
          {children}
        </div>
      </div>
    </>
  )
}
