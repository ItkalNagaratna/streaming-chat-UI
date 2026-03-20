"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface StreamingTextProps {
  text: string
  speed?: number
  isStreaming?: boolean
  className?: string
  cursorColor?: string
}

export const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  speed = 15,
  isStreaming = true,
  className,
  cursorColor = "bg-blue-500",
}) => {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text)
      return
    }

    if (text === displayedText) return

    const timeout = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1))
    }, speed)

    return () => clearTimeout(timeout)
  }, [text, displayedText, speed, isStreaming])

  return (
    <div className={cn("text-base text-zinc-800 dark:text-zinc-200 leading-relaxed", className)}>
      {displayedText.split("\n").map((line, i) => (
        <span key={i}>
          {line}
          {i !== displayedText.split("\n").length - 1 && <br />}
        </span>
      ))}
      {isStreaming && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className={cn("inline-block w-2 h-4 ml-1 align-middle rounded-sm", cursorColor)}
        />
      )}
    </div>
  )
}
