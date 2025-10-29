# tic-tac-toe-classic-186548-186557

This project includes a React frontend for a simple Tic Tac Toe game. A floating OpenAI-powered chat widget can be enabled via environment variables.

## Chatbot Overview
- Floating button appears at bottom-right when enabled.
- Opens a panel with messages, input box, send and reset buttons.
- Uses OpenAI Chat Completions API directly from the frontend.
- Light, modern theme with accents (primary #3b82f6, success #06b6d4).
- If env variables are missing or disabled, the widget does not render and logs a clear console warning.

## Quick Start
1) Navigate to the frontend:
```
cd tic_tac_toe_frontend
```
2) Copy the env example and fill in your OpenAI key (for previews/demos only):
```
cp .env.example .env
```
3) Install and run (typical React setup):
```
npm install
npm start
```
The app should run on http://localhost:3000

## Environment Variables
Place these in `tic_tac_toe_frontend/.env`:
- `REACT_APP_CHATBOT_ENABLED` = `true` to enable the chat widget
- `REACT_APP_OPENAI_API_KEY` = your OpenAI API key (Bearer)
- `REACT_APP_OPENAI_MODEL` = model name (default: `gpt-4o-mini`; you can also try `gpt-4o-mini-2024-07-18`)

## Files Added
- `src/components/Chatbot/ChatWidget.tsx` – Chat UI logic
- `src/components/Chatbot/MessageBubble.tsx` – Message bubble component
- `src/components/Chatbot/index.ts` – Barrel exports
- `src/services/openaiClient.ts` – Minimal fetch-based OpenAI client
- `src/styles/chatbot.css` – Light, modern styling
- `src/App.tsx` – Integrates ChatWidget with env guard
- `.env.example` – Example env configuration

## Notes
- This implementation avoids any backend—calls are made directly to OpenAI.
- For production, do NOT expose secrets in client code. Route via a secure backend or use server-side proxies with key protection.
