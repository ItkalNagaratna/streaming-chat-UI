"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThoughtTrace, ThoughtStep } from "@/components/aura-ui/ThoughtTrace"
import { ContextLens, ContextItem } from "@/components/aura-ui/ContextLens"
import { StreamingText } from "@/components/aura-ui/StreamingText"
import { Sparkles, Send, Bot, User } from "lucide-react"
import { MeshBackground } from "@/components/aura-ui/MeshBackground"

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
    <div className="min-h-screen bg-black text-zinc-100 font-sans relative overflow-hidden flex flex-col items-center pb-32">
      <MeshBackground />

      <div className="w-full max-w-4xl px-4 md:px-8 mt-16 md:mt-24 z-10 flex flex-col">
        <AnimatePresence mode="wait">
          {stage === "idle" ? (
            <motion.div
              key="idle"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.95 }}
              transition={{ duration: 0.5, ease: "anticipate" }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
              }}
              className="flex flex-col items-center justify-center text-center mt-20"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.5, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.5 } }
                }}
                className="relative mb-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-blue-500 blur-3xl rounded-full"
                />
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-white/5 border border-white/10 p-5 rounded-[2rem] text-blue-400 shadow-2xl backdrop-blur-xl cursor-default"
                >
                  <Sparkles className="w-12 h-12" />
                </motion.div>
              </motion.div>

              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-sm"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 animate-text-shimmer bg-[length:200%_auto]">
                  Discover Aura.
                </span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed"
              >
                Experience the next generation of AI-Native components. Redefined for beautiful, contextual, and transparent Answer Engines.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              layout
              key="chat"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                mass: 0.8
              }}
              className="flex flex-col gap-10 w-full"
            >
              {/* User Query Thread */}
              <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="flex gap-4 items-start w-full self-end ml-auto sm:w-5/6 lg:w-3/4"
              >
                <div className="mt-1 bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-2xl flex-shrink-0 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex bg-white/5 border border-white/10 backdrop-blur-xl px-5 py-4 rounded-3xl rounded-tl-sm text-lg font-medium tracking-wide shadow-lg">
                  {activeQuery}
                </div>
              </motion.div>

              {/* AI Response Area */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.3, delay: 0.1 }}
                className="flex flex-col w-full mx-auto relative sm:w-5/6 lg:w-4/5 gap-4"
              >
                <div className="absolute -left-14 top-2 bg-gradient-to-b from-purple-500/20 to-blue-500/20 border border-white/10 p-2.5 rounded-2xl flex-shrink-0 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)] hidden sm:flex">
                  <Bot className="w-5 h-5" />
                </div>

                <div className="flex flex-col gap-6 bg-white/5 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative">
                  <ThoughtTrace
                    steps={thoughtSteps}
                    isFinished={stage === "streaming" || stage === "done"}
                    className="bg-black/20 border-white/5 shadow-inner"
                  />

                  <AnimatePresence>
                    {(stage === "streaming" || stage === "done") && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col gap-8 mt-2"
                      >
                        <ContextLens
                          items={contextItems}
                          className="bg-black/20 border-white/5 rounded-2xl p-4 shadow-inner"
                        />

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <StreamingText
                          text={fullText}
                          isStreaming={stage === "streaming"}
                          speed={15}
                          className="text-white/90 font-light text-[1.05rem] tracking-wide"
                          cursorColor="bg-blue-400"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Form fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-[#050511] via-[#050511]/90 to-transparent flex justify-center z-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl relative flex items-center group"
        >
          <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about building an AI library..."
            disabled={stage === "thinking" || stage === "streaming"}
            className="w-full bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full py-4 pl-7 pr-16 text-white placeholder:text-zinc-500 shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 disabled:opacity-50 transition-all font-light tracking-wide text-lg"
          />
          <button
            type="submit"
            disabled={!query.trim() || stage === "thinking" || stage === "streaming"}
            className="absolute right-3 p-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full transition-all disabled:opacity-50 disabled:grayscale shadow-lg active:scale-95"
          >
            <Send className="w-5 h-5 hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
      </div>

    </div>
  )
}
