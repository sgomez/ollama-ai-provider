'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ReactElement, useEffect, useRef } from 'react'

import { UIState } from '@/app/actions'
import { Info } from '@/components/info'

export function ListMessages({
  messages,
}: {
  messages: UIState
}): ReactElement {
  const messagesEndReference = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndReference.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <>
      {messages.length > 0 ? (
        <>
          <div className="flex flex-col gap-2 h-full w-dvw items-center overflow-y-scroll">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0 ${
                  index === 0 ? 'pt-20' : ''
                }`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message.display}
              </motion.div>
            ))}
          </div>
          <div ref={messagesEndReference} />
        </>
      ) : (
        <>
          <Info>
            <p>
              This is an example of streamUI hook and streaming components with
              Ollama provider.
            </p>
            <p>
              Learn more about the
              <Link
                className="text-blue-500 dark:text-blue-400 mx-1"
                href="https://sdk.vercel.ai/docs/ai-sdk-rsc/overview"
                target="_blank"
              >
                streamUI
              </Link>
              hook from Vercel AI SDK.
            </p>
          </Info>
        </>
      )}
    </>
  )
}
