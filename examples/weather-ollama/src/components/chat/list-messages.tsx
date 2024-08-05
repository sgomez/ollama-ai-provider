import { ReactElement } from 'react'

import { UIState } from '@/app/actions'

export function ListMessages({
  messages,
}: {
  messages?: UIState
}): ReactElement {
  const reversedMessages = messages?.reverse() ?? []

  return (
    <main className="flex-1 overflow-auto p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {reversedMessages.map((message) => (
          <div key={message.id}>{message.display}</div>
        ))}
      </div>
    </main>
  )
}
