'use client'

import { ReactNode } from 'react'

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between gap-4">{children}</div>
    </div>
  )
}
