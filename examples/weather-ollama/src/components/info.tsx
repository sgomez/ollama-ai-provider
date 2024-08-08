'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export const Info = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div className="px-4 w-full md:w-[500px] md:px-0 pt-20">
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        {children}
      </div>
    </motion.div>
  )
}
