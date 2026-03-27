"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ThoughtStep {
  id: string
  title: string
  status: "pending" | "active" | "completed"
  details?: string
}

export interface ThoughtTraceProps {
  steps: ThoughtStep[]
  className?: string
  isFinished?: boolean
}

export const ThoughtTrace: React.FC<ThoughtTraceProps> = ({
  steps,
  className,
  isFinished = false,
}) => {
  const [expanded, setExpanded] = useState(!isFinished)

  useEffect(() => {
    if (isFinished) {
      const timer = setTimeout(() => setExpanded(false), 2000)
      return () => clearTimeout(timer)
    } else {
      setExpanded(true)
    }
  }, [isFinished])

  return (
    <div className={cn("flex flex-col gap-2 w-full max-w-2xl mx-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-sm", className)}>
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {isFinished ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          )}
          <span>{isFinished ? "Reasoning completed" : "Analyzing request..."}</span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-500">
            <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 pl-2 flex flex-col gap-4 relative before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-white/10 before:-z-10 mt-1">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3 relative"
                >
                  <div className="flex-shrink-0 mt-0.5 bg-transparent">
                    {step.status === "completed" && <CheckCircle2 className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />}
                    {step.status === "active" && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                    {step.status === "pending" && <Circle className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={cn(
                      "text-sm",
                      step.status === "active" ? "text-zinc-900 dark:text-zinc-100 font-medium" : "text-zinc-500 dark:text-zinc-400"
                    )}>
                      {step.title}
                    </span>
                    {step.details && step.status === "active" && (
                      <motion.span
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-zinc-500 dark:text-zinc-500"
                      >
                        {step.details}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
