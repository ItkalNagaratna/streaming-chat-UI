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
      case "document": return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "web": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      case "image": return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "code": return "bg-amber-500/10 text-amber-400 border-amber-500/20"
    }
  }

  return (
    <div className={cn("flex flex-col gap-3 w-full max-w-2xl mx-auto", className)}>
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</h3>
        <div className="h-px flex-1 bg-white/10"></div>
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
            className="mt-2 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-sm relative overflow-hidden"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-white/10 text-zinc-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3 pr-6">
              <div className={cn("p-1.5 rounded-md", getColorClass(selectedItem.type).split(' ')[0], getColorClass(selectedItem.type).split(' ')[1])}>
                {getIcon(selectedItem.type)}
              </div>
              <h4 className="font-medium text-sm text-zinc-100">{selectedItem.title}</h4>
              {selectedItem.url && (
                <a href={selectedItem.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-zinc-400 hover:text-blue-500 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {selectedItem.snippet && (
              <div className="text-sm text-zinc-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                &quot;{selectedItem.snippet}&quot;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
