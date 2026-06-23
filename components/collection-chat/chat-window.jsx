"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatWindow({ collectionId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const userQuestion = question;
      setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
      setQuestion("");

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion, collectionId }),
      });
      const data = await res.json();
      if(!res.ok){
      throw new Error(data.error ||"Something went wrong")
      }
      
      const response = data.answer ?? "No response";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error instanceof Error?error.message:"Something went wrong" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Ask about this collection"}
        className="fixed bottom-7 right-7 z-50 w-13 h-13 rounded-full bg-green-800 hover:bg-green-900 text-amber-50 shadow-lg hover:scale-105 transition-all duration-150 flex items-center justify-center"
      >
        {isOpen ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-7 z-40 w-[360px] max-h-[520px] flex flex-col rounded-2xl overflow-hidden border border-stone-300 shadow-2xl bg-amber-50 font-serif">

          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 bg-green-800 shrink-0">
            <span className="w-2 h-2 rounded-full bg-green-300" />
            <h3 className="text-sm font-semibold text-amber-50 tracking-wide">
              Ask about this collection
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 [scrollbar-width:thin] [scrollbar-color:#c8bfa8_transparent]">
            {messages.length === 0 && !loading && (
              <p className="text-center text-stone-400 text-sm italic m-auto py-6">
                Ask anything about your entries.
              </p>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[88%] px-3.5 py-2.5 rounded-xl text-[13.5px] leading-relaxed ${
                  message.role === "user"
                    ? "self-end bg-green-800 text-amber-50 rounded-br-sm"
                    : "self-start bg-stone-200 text-stone-800 border border-stone-300 rounded-bl-sm"
                }`}
              >
                <div className="text-[10px] font-bold tracking-widest uppercase mb-1 opacity-60">
                  {message.role === "user" ? "You" : "Assistant"}
                </div>
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="self-start flex items-center gap-2 text-stone-400 text-xs italic py-1">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-bounce [animation-delay:300ms]" />
                </div>
                Thinking…
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="flex items-end gap-2 px-3.5 py-3 border-t border-stone-300 bg-stone-100 shrink-0">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask away…"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-stone-300 bg-amber-50 px-3 py-2 text-[13.5px] text-stone-800 placeholder:text-stone-400 placeholder:italic outline-none focus:border-green-700 transition-colors leading-relaxed min-h-[38px] max-h-24 font-serif"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !question.trim()}
              aria-label="Send"
              className="w-[38px] h-[38px] shrink-0 rounded-xl bg-green-800 hover:bg-green-900 disabled:opacity-40 disabled:cursor-not-allowed text-amber-50 flex items-center justify-center transition-all duration-150"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}