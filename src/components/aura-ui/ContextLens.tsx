"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Link as LinkIcon, Image as ImageIcon, ExternalLink, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ContextType = "document" | "web" | "image" | "code"

export interface ContextItem {
  id: string
  title: string
  type: ContextType
  snippet?: string
  url?: string
}

export interface ContextLensProps {
  items: ContextItem[]
  className?: string
  title?: string
}

export const ContextLens: React.FC<ContextLensProps> = ({
  items,
  className,
  title = "Context Used",
}) => {
  const [selectedItem, setSelectedItem] = useState<ContextItem | null>(null)

  const getIcon = (type: ContextType) => {
    switch (type) {
      case "document": return <FileText className="w-4 h-4" />
      case "web": return <LinkIcon className="w-4 h-4" />
      case "image": return <ImageIcon className="w-4 h-4" />
      case "code": return <FileText className="w-4 h-4" /> // Fallback for now
    }
  }

  const getColorClass = (type: ContextType) => {
    switch (type) {
      case "document": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
      case "web": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
      case "image": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800"
      case "code": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"
    }
  }

  return (
    <div className={cn("flex flex-col gap-3 w-full max-w-2xl mx-auto", className)}>
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{title}</h3>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedItem(item)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:opacity-80",
                getColorClass(item.type)
              )}
            >
              {getIcon(item.type)}
              <span className="truncate max-w-[120px]">{item.title}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3 pr-6">
              <div className={cn("p-1.5 rounded-md", getColorClass(selectedItem.type).split(' ')[0], getColorClass(selectedItem.type).split(' ')[1])}>
                {getIcon(selectedItem.type)}
              </div>
              <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{selectedItem.title}</h4>
              {selectedItem.url && (
                <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-zinc-400 hover:text-blue-500 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {selectedItem.snippet && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
                "{selectedItem.snippet}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
