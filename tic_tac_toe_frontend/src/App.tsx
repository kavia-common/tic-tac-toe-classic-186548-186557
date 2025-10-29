import React from "react";
import { ChatWidget } from "./components/Chatbot";
import "./styles/chatbot.css";

/**
 * PUBLIC_INTERFACE
 * Main App entry. This file conditionally mounts the ChatWidget
 * based on environment flags to avoid interfering with preview systems.
 */
function App() {
  const enabled = String(process.env.REACT_APP_CHATBOT_ENABLED || "").toLowerCase() === "true";
  const hasKey = Boolean(process.env.REACT_APP_OPENAI_API_KEY);

  if (!enabled) {
    console.warn("[Chatbot] Disabled: Set REACT_APP_CHATBOT_ENABLED=true to enable the chat widget.");
  } else if (!hasKey) {
    console.warn("[Chatbot] Missing REACT_APP_OPENAI_API_KEY. Widget will not render.");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", color: "#111827" }}>
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1 style={{ marginBottom: 8 }}>Tic Tac Toe</h1>
        <p style={{ color: "#64748b" }}>
          This is a placeholder UI. The game can be integrated here.
        </p>
      </div>

      {enabled && hasKey ? <ChatWidget /> : null}
    </div>
  );
}

export default App;
