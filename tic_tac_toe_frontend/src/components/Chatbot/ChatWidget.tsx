import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./../../styles/chatbot.css";
import { MessageBubble } from "./MessageBubble";
import { createOpenAIClient } from "../../services/openaiClient";

type Role = "system" | "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

const SYSTEM_PROMPT =
  "You are a friendly, concise assistant for a Tic Tac Toe game. Help users with rules, strategy tips, and general questions. Keep replies short and approachable.";

// PUBLIC_INTERFACE
export function ChatWidget() {
  /** A floating chat widget that talks to OpenAI Chat Completions using env config. */
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! Need help with Tic Tac Toe or anything else?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);

  const client = useMemo(() => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const model =
      process.env.REACT_APP_OPENAI_MODEL && process.env.REACT_APP_OPENAI_MODEL.trim().length > 0
        ? process.env.REACT_APP_OPENAI_MODEL
        : "gpt-4o-mini";
    return createOpenAIClient({
      apiKey,
      model,
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setError(null);
    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    const history = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages,
      userMsg,
    ];

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const assistantReply = await client.completeChat(history);
      setMessages((m) => [...m, { role: "assistant", content: assistantReply }]);
    } catch (e: any) {
      console.error("Chat error:", e);
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{ role: "assistant", content: "Chat reset. How can I help?" }]);
    setError(null);
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        className="cbt-fab"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? (
          <span className="cbt-icon">×</span>
        ) : (
          <span className="cbt-icon">💬</span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="cbt-panel">
          <div className="cbt-header">
            <div>
              <strong>Tic Tac Toe Assistant</strong>
              <div className="cbt-sub">Ask tips, rules, or chat casually</div>
            </div>
            <div className="cbt-actions">
              <button className="cbt-reset" onClick={handleReset} title="Reset chat">
                Reset
              </button>
              <button className="cbt-close" onClick={() => setOpen(false)} title="Close">
                ×
              </button>
            </div>
          </div>

          <div className="cbt-messages" ref={listRef}>
            {messages.map((m, idx) => (
              <MessageBubble key={idx} role={m.role} content={m.content} />
            ))}
            {loading && (
              <div className="cbt-loading">
                <div className="cbt-spinner" />
                <span>Thinking…</span>
              </div>
            )}
            {error && <div className="cbt-error">{error}</div>}
          </div>

          <div className="cbt-input-row">
            <input
              type="text"
              className="cbt-input"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              disabled={loading}
            />
            <button className="cbt-send" onClick={handleSend} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
