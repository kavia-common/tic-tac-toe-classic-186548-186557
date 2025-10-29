export interface OpenAIClientOptions {
  apiKey?: string;
  model?: string;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Minimal client for OpenAI Chat Completions using fetch.
 * PUBLIC_INTERFACE
 */
export function createOpenAIClient(options: OpenAIClientOptions) {
  const apiKey = options.apiKey || process.env.REACT_APP_OPENAI_API_KEY;
  const model =
    (options.model || process.env.REACT_APP_OPENAI_MODEL)?.trim() ||
    "gpt-4o-mini";

  if (!apiKey) {
    // We explicitly do not throw here because the widget mounting may be gated.
    // Consumers calling this client directly should guard for missing key.
    console.warn(
      "[Chatbot] Missing REACT_APP_OPENAI_API_KEY. Chatbot will be disabled."
    );
  }

  return {
    /**
     * PUBLIC_INTERFACE
     * Perform a single-turn chat completion given a messages array.
     * Returns the assistant content string.
     */
    async completeChat(messages: ChatMessage[]): Promise<string> {
      if (!apiKey) {
        throw new Error(
          "OpenAI API key is missing. Set REACT_APP_OPENAI_API_KEY in your environment."
        );
      }

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `OpenAI API error: ${res.status} ${res.statusText}${text ? " - " + text : ""}`
        );
      }

      const data = await res.json();
      const content =
        data?.choices?.[0]?.message?.content ??
        data?.choices?.[0]?.delta?.content ??
        "";

      if (!content) {
        throw new Error("Empty response from OpenAI.");
      }
      return content;
    },
  };
}
