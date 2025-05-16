"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { ArrowRight, Send } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Define proper type for markdown component props
type MarkdownComponentProps = {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const chatId = "my-unique-chat-id";

  // Set visibility for animations on load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fixMarkdownTables = (markdown: string): string => {
    // Check for improperly formatted tables with multiple consecutive pipe characters
    const badTableRegex = /\|\s*(\w+[^|]*)\s*\|\s*(\w+[^|]*)\s*\|\s*(\w+[^|]*)\s*\|(?:\s*\|)/g;
    
    // Find all potential tables in the markdown
    let potentialTables = markdown.match(/\|.*\|.*\n\|.*\|/gs);
    
    if (potentialTables) {
      for (const tableText of potentialTables) {
        // Check if table seems malformed (missing line breaks, extra pipes)
        if (tableText.split('\n').length < 3 || tableText.includes('| |')) {
          // Split the table text into rows by finding pipe character groups
          let rows = tableText.split(/\n|\|\s*\|/).filter(row => row.trim().length > 0 && row.includes('|'));
          
          // Extract header cells from the first row
          let headerRow = rows[0];
          let headerCells = headerRow.split('|').filter(cell => cell.trim().length > 0);
          
          // Build a properly formatted table
          let properTable = `| ${headerCells.join(' | ')} |\n`;
          
          // Add separator row
          properTable += `| ${headerCells.map(() => '---').join(' | ')} |\n`;
          
          // Add data rows
          for (let i = 1; i < rows.length; i++) {
            let cells = rows[i].split('|').filter(cell => cell.trim().length > 0);
            if (cells.length > 0) {
              properTable += `| ${cells.join(' | ')} |\n`;
            }
          }
          
          // Replace the original table with the fixed version
          markdown = markdown.replace(tableText, properTable);
        }
      }
    }
    
    // Additional fix for tables where columns are doubled
    markdown = markdown.replace(/\|\s*([^|\n]+)\s*\|\s*([^|\n]+)\s*\|\s*([^|\n]+)\s*\|\s*\|/g, 
                              "| $1 | $2 | $3 |");
    
    return markdown;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, chat_id: chatId }),
      });

      const data = await res.json();
      if (data.response) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  // Table components with custom implementation
  const CustomTable = ({ children, ...props }: MarkdownComponentProps) => {
    return (
      <div className="overflow-x-auto my-6 rounded-lg border border-gray-700 shadow-md">
        <table className="min-w-full divide-y divide-gray-700 table-auto border-collapse bg-gray-800" {...props}>
          {children}
        </table>
      </div>
    );
  };

  const CustomTableCell = ({ children, isHeader, ...props }: MarkdownComponentProps & { isHeader?: boolean }) => {
    if (isHeader) {
      return (
        <th className="px-6 py-3 text-left text-xs font-medium text-pink-300 uppercase tracking-wider border border-gray-700 bg-gray-900" {...props}>
          {children}
        </th>
      );
    }
    return (
      <td className="px-6 py-4 whitespace-normal text-sm text-gray-300 border border-gray-700" {...props}>
        {children}
      </td>
    );
  };

  const CustomTableRow = ({ children, isHeader, ...props }: MarkdownComponentProps & { isHeader?: boolean }) => {
    return (
      <tr className={`${isHeader ? "bg-gray-900" : "hover:bg-gray-700 transition-colors duration-200"}`} {...props}>
        {children}
      </tr>
    );
  };

  // Markdown components with professional styling
  const markdownComponents = {
    // Headings with proper styling
    h1: ({ children, ...props }: MarkdownComponentProps) => (
      <h1 className="text-2xl font-semibold text-pink-300 mt-6 mb-4" {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: MarkdownComponentProps) => (
      <h2 className="text-xl font-semibold text-pink-200 mt-5 mb-3" {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: MarkdownComponentProps) => (
      <h3 className="text-lg font-semibold text-pink-200 mt-4 mb-2" {...props}>{children}</h3>
    ),
    h4: ({ children, ...props }: MarkdownComponentProps) => (
      <h4 className="text-base font-semibold text-pink-100 mt-3 mb-2" {...props}>{children}</h4>
    ),
    
    // Paragraph and text elements
    p: ({ children, ...props }: MarkdownComponentProps) => (
      <p className="text-gray-300 mb-4 leading-relaxed" {...props}>{children}</p>
    ),
    strong: ({ children, ...props }: MarkdownComponentProps) => (
      <strong className="font-medium text-pink-200" {...props}>{children}</strong>
    ),
    em: ({ children, ...props }: MarkdownComponentProps) => (
      <em className="text-pink-100 italic" {...props}>{children}</em>
    ),
    
    // Lists
    ul: ({ children, ...props }: MarkdownComponentProps) => (
      <ul className="list-disc pl-6 mb-4 space-y-2" {...props}>{children}</ul>
    ),
    ol: ({ children, ...props }: MarkdownComponentProps) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2" {...props}>{children}</ol>
    ),
    li: ({ children, ...props }: MarkdownComponentProps) => (
      <li className="mb-1 text-gray-300" {...props}>{children}</li>
    ),
    
    // Code blocks and inline code
    code: ({ children, inline, ...props }: MarkdownComponentProps & { inline?: boolean }) => 
      inline ? (
        <code className="bg-gray-800 text-pink-300 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>{children}</code>
      ) : (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6 border border-gray-700">
          <code className="font-mono text-sm block" {...props}>{children}</code>
        </pre>
      ),
    
    // Block quotes
    blockquote: ({ children, ...props }: MarkdownComponentProps) => (
      <blockquote className="border-l-4 border-pink-300 pl-4 py-2 bg-gray-800/50 rounded-r-lg text-gray-300 italic mb-6" {...props}>{children}</blockquote>
    ),
    
    // Table components
    table: CustomTable,
    thead: ({ children, ...props }: MarkdownComponentProps) => (
      <thead className="bg-gray-900 border-b border-gray-700" {...props}>{children}</thead>
    ),
    tbody: ({ children, ...props }: MarkdownComponentProps) => (
      <tbody className="bg-gray-800 divide-y divide-gray-700" {...props}>{children}</tbody>
    ),
    tr: ({ children, isHeader, ...props }: MarkdownComponentProps & { isHeader?: boolean }) => (
      <CustomTableRow isHeader={isHeader} {...props}>{children}</CustomTableRow>
    ),
    th: ({ children, ...props }: MarkdownComponentProps) => (
      <CustomTableCell isHeader={true} {...props}>{children}</CustomTableCell>
    ),
    td: ({ children, ...props }: MarkdownComponentProps) => (
      <CustomTableCell {...props}>{children}</CustomTableCell>
    ),
    
    // Horizontal rule
    hr: (props: MarkdownComponentProps) => (
      <hr className="my-8 border-t border-gray-700 w-1/2 mx-auto" {...props} />
    ),
    
    // Links
    a: ({ children, ...props }: MarkdownComponentProps) => (
      <a className="text-pink-300 hover:text-pink-200 hover:underline transition-colors duration-200" {...props}>{children}</a>
    ),
  };

  // Process message content to fix tables before rendering
  const processMessageContent = (content: string) => {
    return fixMarkdownTables(content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white flex flex-col font-sans">
      {/* Background animated elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-400/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-200/10 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Navigation Bar */}
      <nav 
        className="p-4 backdrop-blur-sm bg-black/20 sticky top-0 z-50 flex justify-between items-center border-b border-gray-800"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease'
        }}
      >
        <div className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-pink-300 to-pink-400 text-white p-2 rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-bold">Sparky Chat</span>
        </div>
      </nav>

      {/* Chat Content Area */}
      <div 
        className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-4 py-6"
        style={{ 
          opacity: isVisible ? 1 : 0, 
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
        }}
      >
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="bg-gradient-to-r from-pink-300 to-pink-400 text-gray-900 p-3 rounded-full mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-pink-400">
                Welcome to Sparky Chat
              </h2>
              <p className="text-gray-400 max-w-md">
                Your AI assistant for auto electrical questions. Ask anything about troubleshooting, wiring, or electrical systems.
              </p>
            </div>
          )}

            {messages.map((msg, idx) => (
            <div
              key={`${msg.role}-${idx}`}
              className={`message-animate max-w-[85%] ${
              msg.role === "user" ? "ml-auto" : "mr-auto"
              }`}
            >
              <div
              className={`p-5 rounded-xl shadow-md ${
                msg.role === "user"
                ? "bg-gradient-to-b from-gray-800 to-gray-900 border-2 border-pink-300 text-white rounded-br-none"
                : "bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 text-white rounded-bl-none"
              }`}
              >
              {msg.role === "user" ? (
                <p className="text-lg leading-relaxed">{msg.content}</p>
                ) : (
                  <div className="prose max-w-none prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={markdownComponents}
                  >
                    {processMessageContent(msg.content)}
                  </ReactMarkdown>
                  </div>
                )}
                </div>
              <div className="flex items-center mt-1.5 text-xs text-gray-400">
                {msg.role === "user" ? (
                  <span className="ml-auto font-medium">You</span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-300 to-pink-400"></div>
                    <span className="font-medium">Sparky</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="mr-auto">
              <div className="typing-indicator flex gap-1.5 p-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-md border border-gray-700">
                <div className="typing-dot bg-pink-300 h-2 w-2 rounded-full animate-pulse"></div>
                <div className="typing-dot bg-pink-300 h-2 w-2 rounded-full animate-pulse delay-100"></div>
                <div className="typing-dot bg-pink-300 h-2 w-2 rounded-full animate-pulse delay-200"></div>
              </div>
              <div className="flex items-center mt-1.5 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-300 to-pink-400"></div>
                  <span className="font-medium">Sparky is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`relative transition-all duration-300 ${isInputFocused ? 'transform scale-[1.01]' : ''}`}>
          <div className="flex gap-2 relative">
            <input
              type="text"
              className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300/30 focus:border-pink-300/50 transition-all shadow-md"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Sparky anything about auto electrics..."
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            <button
              onClick={sendMessage}
              className={`bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-200 hover:to-pink-300 text-gray-900 px-6 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-pink-300/30 flex items-center justify-center gap-2 group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <span>Send</span>
              <Send size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          {isInputFocused && (
            <div className="absolute inset-0 -z-10 rounded-xl bg-pink-300/10 opacity-50 blur-md"></div>
          )}
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        code, pre {
          font-family: 'Roboto Mono', monospace;
        }
        
        .typing-dot {
          animation-duration: 1.5s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        
        .delay-100 {
          animation-delay: 0.2s;
        }
        
        .delay-200 {
          animation-delay: 0.4s;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .4;
          }
        }
        
        .animate-blob {
          animation: blob 12s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.2);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.8);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .message-animate {
          animation: fadeIn 0.4s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Custom table styles */
        .prose table {
          border-collapse: separate !important;
          border-spacing: 0 !important;
          width: 100% !important;
          margin: 1rem 0 !important;
          overflow: hidden !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        
        .prose table th,
        .prose table td {
          padding: 0.75rem 1rem !important;
          vertical-align: top !important;
        }
        
        .prose table th {
          font-weight: 500 !important;
          text-transform: uppercase !important;
          font-size: 0.75rem !important;
          letter-spacing: 0.05em !important;
        }
        
        .prose table tr {
          transition: background-color 0.2s ease !important;
        }
        
        .prose table p {
          margin: 0 !important;
        }
        
        /* Better typography */
        body {
          font-feature-settings: "salt" 1, "ss01" 1, "ss02" 1;
          letter-spacing: -0.01em;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .prose {
          font-size: 1rem;
          line-height: 1.6;
        }
        
        .prose p {
          margin-bottom: 1.25em;
        }
        
        .prose strong {
          color: rgb(249, 168, 212);
          font-weight: 600;
        }
        
        .prose a {
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }
      `}</style>
    </div>
  );
}