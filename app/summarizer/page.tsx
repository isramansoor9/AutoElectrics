"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { ArrowRight, Video } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Define proper type for markdown component props
type MarkdownComponentProps = {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
};

export default function SummarizerPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [isYoutubeFocused, setIsYoutubeFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const submitYoutube = async () => {
    if (!youtubeUrl.trim()) return;

    setSummary("");
    setSummaryLoading(true);

    try {
      const res = await fetch("http://localhost:5000/process-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      const data = await res.json();
      if (data.summary) {
        setSummary(data.summary);
      } else if (data.error) {
        setSummary(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setSummary("An error occurred.");
    } finally {
      setSummaryLoading(false);
    }
  };

  const markdownComponents = {
    p: ({ children, ...props }: MarkdownComponentProps) => (
      <p className="text-gray-300 mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    strong: ({ children, ...props }: MarkdownComponentProps) => (
      <strong className="font-medium text-pink-300" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }: MarkdownComponentProps) => (
      <em className="text-gray-300 italic" {...props}>
        {children}
      </em>
    ),
    a: ({ children, ...props }: MarkdownComponentProps) => (
      <a
        className="text-pink-300 hover:text-pink-200 hover:underline transition-colors duration-200"
        {...props}
      >
        {children}
      </a>
    ),
    h1: ({ children, ...props }: MarkdownComponentProps) => (
      <h1 className="text-2xl font-bold text-pink-300 mb-4" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: MarkdownComponentProps) => (
      <h2 className="text-xl font-bold text-pink-300 mb-3" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: MarkdownComponentProps) => (
      <h3 className="text-lg font-bold text-pink-300 mb-2" {...props}>
        {children}
      </h3>
    ),
    ul: ({ children, ...props }: MarkdownComponentProps) => (
      <ul className="list-disc pl-5 mb-4 text-gray-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: MarkdownComponentProps) => (
      <ol className="list-decimal pl-5 mb-4 text-gray-300" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: MarkdownComponentProps) => (
      <li className="mb-1 text-gray-300" {...props}>
        {children}
      </li>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      {/* Navigation Bar */}
      <nav className="p-6 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-pink-300 to-pink-400 text-white p-2 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold">Sparky</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex space-x-8"
          >
            <Link href="/features" className="hover:text-pink-300 transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-pink-300 transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-pink-300 transition-colors">About</Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/login"
              className="bg-gradient-to-r from-pink-300 to-pink-400 text-gray-900 px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-pink-300/30"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400">
              Video Summarizer
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl">
              Extract key insights from automotive tutorial videos. Turn hours of content into concise, actionable summaries to accelerate your learning process.
            </p>
          </motion.div>

          {/* YouTube URL Input */}
          <motion.div 
            className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 hover:border-pink-300 transition-all duration-300 shadow-lg hover:shadow-pink-300/20 mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full w-14 h-14 flex items-center justify-center mr-4 group-hover:bg-gradient-to-br group-hover:from-pink-300 group-hover:to-pink-400 transition-all duration-300">
                <Video size={28} className="text-pink-300" />
              </div>
              <h2 className="text-2xl font-bold">Enter YouTube URL</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 transition-all text-white"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste YouTube URL..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitYoutube();
                  }}
                  onFocus={() => setIsYoutubeFocused(true)}
                  onBlur={() => setIsYoutubeFocused(false)}
                />
                {isYoutubeFocused && (
                  <div className="absolute inset-0 -z-10 rounded-lg bg-pink-300/20 opacity-30 blur-sm"></div>
                )}
              </div>
              <button
                onClick={submitYoutube}
                className="bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-200 hover:to-pink-300 text-gray-900 px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-pink-300/30 flex items-center justify-center gap-2 group"
                disabled={summaryLoading}
              >
                <span>Summarize</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* Loading Indicator */}
          {summaryLoading && (
            <motion.div 
              className="flex flex-col items-center justify-center p-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 border-4 border-gray-700 border-t-pink-300 rounded-full animate-spin mb-4"></div>
              <p className="text-pink-300 text-lg font-medium">Processing video...</p>
            </motion.div>
          )}

          {/* Summary Display */}
          {summary && (
            <motion.div 
              className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 hover:border-pink-300 transition-all duration-300 shadow-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-pink-400">
                Video Summary
              </h3>
              <div className="prose max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={markdownComponents}
                >
                  {summary}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      
    </div>
  );
}