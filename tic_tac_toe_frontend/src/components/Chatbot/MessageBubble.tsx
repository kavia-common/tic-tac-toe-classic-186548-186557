import React from "react";

export interface MessageBubbleProps {
  role: "system" | "user" | "assistant";
  content: string;
}

// PUBLIC_INTERFACE
export function MessageBubble({ role, content }: MessageBubbleProps) {
  /** Render a message bubble with role-based styling */
  const isUser = role === "user";
  const isAssistant = role === "assistant";
  const classes = [
    "cbt-bubble",
    isUser ? "cbt-bubble-user" : "",
    isAssistant ? "cbt-bubble-assistant" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="cbt-bubble-content">{content}</div>
    </div>
  );
}

export default MessageBubble;
