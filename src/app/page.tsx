"use client"

import React, { useState, useEffect } from "react"
import { ThoughtTrace, ThoughtStep } from "@/components/aura-ui/ThoughtTrace"
import { ContextLens, ContextItem } from "@/components/aura-ui/ContextLens"
import { StreamingText } from "@/components/aura-ui/StreamingText"
import { Sparkles, Send } from "lucide-react"

export default function Home() {
  const [stage, setStage] = useState<"idle" | "thinking" | "streaming" | "done">("idle")
  const [query, setQuery] = useState("")
  const [activeQuery, setActiveQuery] = useState("")

  const [thoughtSteps, setThoughtSteps] = useState<ThoughtStep[]>([
    { id: "1", title: "Parsing user query", status: "pending" },
    { id: "2", title: "Searching knowledge base", status: "pending" },
    { id: "3", title: "Synthesizing information", status: "pending" },
  ])

  const contextItems: ContextItem[] = [
    {
      id: "doc1",
      title: "UI Design Principles.pdf",
      type: "document",
      snippet: "Good UI design focuses on anticipating what users might need to do and ensuring that the interface has elements that are easy to access, understand, and use to facilitate those actions."
    },
    {
      id: "web1",
      title: "Tailwind CSS Docs",
      type: "web",
      url: "https://tailwindcss.com",
      snippet: "Rapidly build modern websites without ever leaving your HTML. A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup."
    },
    {
      id: "code1",
      title: "framer-motion-utils.ts",
      type: "code",
      snippet: "export const spring = { type: 'spring', stiffness: 500, damping: 30 };"
    }
  ]

  const fullText = "Building an AI-native UI library requires moving beyond traditional chat interfaces. You need to focus on how AI actually operates:\n\n1. **Transparency**: Users need to see the AI's reasoning process. Components like `ThoughtTrace` help build trust by showing step-by-step analysis.\n\n2. **Context Awareness**: AI responses are only as good as their context. `ContextLens` allows you to elegantly display exactly what sources the AI is referencing, preventing hallucinations and adding credibility.\n\n3. **Fluidity**: AI generates responses in real-time. A robust `StreamingText` component ensures this delivery feels natural and polished, unlike blocky, janky text rendering.\n\nBy combining these elements, you create an interface that feels like a true 'Answer Engine' rather than just a chatbot wrapper."

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setActiveQuery(query)
    setQuery("")
    setStage("thinking")

    // Reset steps
    setThoughtSteps([
      { id: "1", title: "Parsing user query", status: "active", details: `Analyzing intent for: "${query}"` },
      { id: "2", title: "Searching knowledge base", status: "pending" },
      { id: "3", title: "Synthesizing information", status: "pending" },
    ])
  }

  useEffect(() => {
    if (stage === "thinking") {
      const t1 = setTimeout(() => {
        setThoughtSteps(prev => [
          { ...prev[0], status: "completed" },
          { ...prev[1], status: "active", details: "Found 3 relevant sources" },
          prev[2]
        ])
      }, 1500)

      const t2 = setTimeout(() => {
        setThoughtSteps(prev => [
          prev[0],
          { ...prev[1], status: "completed" },
          { ...prev[2], status: "active", details: "Drafting response based on extracted context" }
        ])
      }, 3000)

      const t3 = setTimeout(() => {
        setThoughtSteps(prev => [
          prev[0], prev[1],
          { ...prev[2], status: "completed" }
        ])
        setStage("streaming")
      }, 4500)

      return () => {
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      }
    }
  }, [stage])

  useEffect(() => {
    if (stage === "streaming") {
      // Approximate time for streaming to finish based on fullText length and speed (15ms per char)
      const streamDuration = fullText.length * 15 + 500
      const t = setTimeout(() => {
        setStage("done")
      }, streamDuration)

      return () => clearTimeout(t)
    }
  }, [stage])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-8 font-sans pb-32">
      <div className="max-w-3xl mx-auto flex flex-col gap-12 pt-12">

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400 w-fit">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Aura UI</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">AI-Native Components for Answer Engines</p>
        </div>

        {stage === "idle" ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <Sparkles className="w-8 h-8 mb-4 opacity-50" />
            <p>Ask a question to see Aura UI in action.</p>
            <p className="text-sm mt-2 opacity-60">Try asking about "building an AI library"</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* User Query */}
            <div className="text-2xl font-semibold px-4 border-l-4 border-zinc-200 dark:border-zinc-800">
              {activeQuery}
            </div>

            {/* AI Response Area */}
            <div className="flex flex-col gap-6 bg-white dark:bg-zinc-900/50 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">

              <ThoughtTrace
                steps={thoughtSteps}
                isFinished={stage === "streaming" || stage === "done"}
              />

              {(stage === "streaming" || stage === "done") && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-300 fill-mode-both flex flex-col gap-8 mt-4">

                  <ContextLens items={contextItems} />

                  <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800" />

                  <StreamingText
                    text={fullText}
                    isStreaming={stage === "streaming"}
                    speed={15}
                  />

                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Input Form fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent dark:from-zinc-950 dark:via-zinc-950">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything..."
            disabled={stage === "thinking" || stage === "streaming"}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full py-4 pl-6 pr-14 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={!query.trim() || stage === "thinking" || stage === "streaming"}
            className="absolute right-2 p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-blue-500"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  )
}
