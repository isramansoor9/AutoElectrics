// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Video, Wrench, BookOpen, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

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

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 via-pink-300 to-pink-400">
              Master Auto Electrics with Sparky
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl">
              Your personal AI assistant designed to transform you from a beginner to a professional auto electrician. Learn, practice, and perfect your skills with personalized guidance.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Chat Assistant Card */}
            <motion.div 
              className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 hover:border-pink-300 transition-all duration-300 shadow-lg hover:shadow-pink-300/20 group"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-pink-300 group-hover:to-pink-400 transition-all duration-300">
                <MessageCircle size={28} className="text-pink-300 group-hover:text-white transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Sparky Chat Assistant</h2>
              <p className="text-gray-400 mb-6">
                Get instant answers to all your auto electrical questions. Troubleshoot problems, learn new concepts, and deepen your understanding through interactive conversations.
              </p>
              <Link
                href="/chat"
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-200 hover:to-pink-300 text-gray-900 px-6 py-3 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto justify-center shadow-md hover:shadow-pink-300/30"
              >
                <span>Start Chatting</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Video Summarizer Card */}
            <motion.div 
              className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-8 hover:border-pink-300 transition-all duration-300 shadow-lg hover:shadow-pink-300/20 group"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 40 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full w-14 h-14 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-pink-300 group-hover:to-pink-400 transition-all duration-300">
                <Video size={28} className="text-pink-300 group-hover:text-gray-900 transition-colors duration-300" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Video Summarizer</h2>
              <p className="text-gray-400 mb-6">
                Extract key insights from automotive tutorial videos. Turn hours of content into concise, actionable summaries to accelerate your learning process.
              </p>
              <Link
                href="/summarizer"
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-200 hover:to-pink-300 text-gray-900 px-6 py-3 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto justify-center shadow-md hover:shadow-pink-300/30"
              >
                <span>Summarize Videos</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Why Choose Sparky Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-pink-400">
              Why Choose Sparky?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-pink-300/30 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-pink-300/30 group-hover:to-pink-400/30 transition-all duration-300">
                  <BookOpen size={24} className="text-pink-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">Comprehensive Learning</h3>
                <p className="text-gray-400">Structured learning paths designed by expert auto electricians with decades of industry experience.</p>
              </div>
              
              <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-pink-300/30 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-pink-300/30 group-hover:to-pink-400/30 transition-all duration-300">
                  <Wrench size={24} className="text-pink-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">Practical Application</h3>
                <p className="text-gray-400">Real-world examples and troubleshooting scenarios that prepare you for actual workshop situations.</p>
              </div>
              
              <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-pink-300/30 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-pink-300/30 group-hover:to-pink-400/30 transition-all duration-300">
                  <Shield size={24} className="text-pink-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">Trusted & Accurate</h3>
                <p className="text-gray-400">All content is verified by certified professionals to ensure you receive the most accurate information.</p>
              </div>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div 
            className="bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 border border-gray-700 rounded-xl p-8 mb-16 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center text-2xl font-bold text-gray-900">
                MT
              </div>
              <div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-pink-300 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 italic mb-4">
                  "Sparky has completely transformed how I learn auto electrical systems. The chat assistant answers my questions instantly, and the video summarizer saves me hours of time. This is the tool I wish I had when I started my career!"
                </p>
                <p className="text-pink-300 font-medium">— Michael T., Professional Auto Technician</p>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center bg-gradient-to-r from-black via-gray-900 to-black p-10 rounded-2xl border border-gray-800 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-pink-400">Ready to become an auto electrics pro?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of automotive professionals who are accelerating their careers with Sparky's intelligent learning platform.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link
                href="/chat"
                className="bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-200 hover:to-pink-300 text-gray-900 px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-pink-300/30 flex items-center justify-center space-x-2 group"
              >
                <span>Chat with Sparky</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/summarizer"
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-medium transition-colors duration-300 border border-gray-600 hover:border-pink-300/50 flex items-center justify-center space-x-2 group"
              >
                <span>Try Video Summarizer</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-gradient-to-b from-transparent to-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-pink-300 font-bold mb-4">Sparky</h3>
              <p className="text-gray-400 text-sm">Your journey to electrical mastery starts here. Expert knowledge at your fingertips.</p>
            </div>
            <div>
              <h3 className="text-pink-300 font-bold mb-4">Features</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link href="/chat" className="hover:text-pink-300 transition-colors">Chat Assistant</Link></li>
                <li><Link href="/summarizer" className="hover:text-pink-300 transition-colors">Video Summarizer</Link></li>
                <li><Link href="/courses" className="hover:text-pink-300 transition-colors">Interactive Courses</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-pink-300 font-bold mb-4">Resources</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link href="/blog" className="hover:text-pink-300 transition-colors">Blog</Link></li>
                <li><Link href="/tutorials" className="hover:text-pink-300 transition-colors">Tutorials</Link></li>
                <li><Link href="/faqs" className="hover:text-pink-300 transition-colors">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-pink-300 font-bold mb-4">Contact</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><Link href="/support" className="hover:text-pink-300 transition-colors">Support</Link></li>
                <li><Link href="/contact" className="hover:text-pink-300 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-6">
            <p>© {new Date().getFullYear()} Sparky Auto Electrics | Your Journey to Electrical Mastery</p>
          </div>
        </div>
      </footer>
    </div>
  );
}