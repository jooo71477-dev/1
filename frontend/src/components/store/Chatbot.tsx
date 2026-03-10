"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "مرحباً بك في متجر ICLOTH! أنا المساعد الذكي، كيف يمكنني مساعدتك في التسوق اليوم؟ 🛍️" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // تنسيق المحادثة السابقة لتطابق ما يتوقعه نموذج جيميني
      const history = messages.slice(1).map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "عذراً، حدث خطأ. تأكد من إضافة GEMINI_API_KEY في ملف .env.local الخاص بك." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "عذراً، حدث خطأ غير متوقع. يرجى المحاولة لاحقاً." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* الزر العائم لفتح الشات */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 md:right-6 md:left-auto z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#ef0000] text-white shadow-[0_0_20px_rgba(239,0,0,0.5)] transition-transform hover:scale-110 active:scale-95 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="مساعدة"
      >
        <MessageCircle size={32} />
      </button>

      {/* نافذة المحادثة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-6 md:right-6 md:left-auto z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-[24px] bg-[#08080a] shadow-2xl border border-white/5"
          >
            {/* الجزء العلوي (Header) */}
            <div className="flex items-center justify-between bg-[#111113] border-b border-white/5 px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-[#ef0000] p-2 rounded-full shadow-[0_0_10px_rgba(239,0,0,0.5)]">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                   <h3 className="font-bold text-sm">مساعد ICLOTH الذكي</h3>
                   <span className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 block" /> متصل
                   </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                aria-label="إغلاق الشات"
              >
                <X size={20} />
              </button>
            </div>

            {/* صفحة الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#08080a] scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#ef0000] text-white rounded-tl-none shadow-[0_5px_15px_rgba(239,0,0,0.3)]"
                        : "bg-[#111113] border border-white/5 text-zinc-200 rounded-tr-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#111113] border border-white/5 rounded-2xl rounded-tr-none px-4 py-4 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* مربع إدخال النص */}
            <div className="bg-[#111113] border-t border-white/5 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 relative bg-[#08080a] rounded-full px-1 py-1 border border-white/10 focus-within:border-zinc-500 transition-colors"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اسأل بثقة..."
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 font-medium"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ef0000] text-white transition-all hover:bg-[#d00000] disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="إرسال"
                >
                  <Send size={16} className="rotate-180 ml-1" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
