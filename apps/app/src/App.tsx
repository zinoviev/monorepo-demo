import { useState, useEffect } from "react";
import { context } from "@zinoviev/monorepo-demo-client";

interface ChatMessage {
  id: number;
  text: string;
  from: "shell" | "app";
}

export function App() {
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const unsubscribeReady = context.onReady(() => {
      setIsReady(true);
    });

    const unsubscribeMessage = context.onMessage((message) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: message, from: "shell" },
      ]);
    });

    return () => {
      unsubscribeReady();
      unsubscribeMessage();
    };
  }, []);

  const handleSend = () => {
    if (!inputValue.trim() || !isReady) return;

    const message = inputValue.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: message, from: "app" },
    ]);
    context.chatMessage(message);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#7c3aed",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ margin: "0 0 8px 0", color: "#fff" }}>App Chat</h2>

      {/* Status indicator */}
      <div
        data-testid="app-status"
        data-status={isReady ? "connected" : "initializing"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: isReady ? "#22c55e" : "#eab308",
          }}
        />
        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
          {isReady ? "Connected" : "Initializing..."}
        </span>
      </div>

      {/* Messages */}
      <div
        data-testid="app-messages"
        style={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
            No messages yet
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              data-testid={`app-message-${msg.from}`}
              style={{
                padding: "8px 12px",
                marginBottom: "8px",
                borderRadius: "8px",
                backgroundColor: msg.from === "app" ? "#a855f7" : "rgba(255,255,255,0.9)",
                color: msg.from === "app" ? "#fff" : "#1a1a1a",
                maxWidth: "80%",
                marginLeft: msg.from === "app" ? "auto" : "0",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  opacity: 0.7,
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                {msg.from === "app" ? "App" : "Shell"}
              </span>
              {msg.text}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          data-testid="app-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={!isReady}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "8px",
            border: "none",
            fontSize: "14px",
            outline: "none",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        />
        <button
          data-testid="app-send-button"
          onClick={handleSend}
          disabled={!isReady || !inputValue.trim()}
          style={{
            padding: "12px 24px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: isReady ? "#a855f7" : "rgba(255,255,255,0.3)",
            color: "#fff",
            fontSize: "14px",
            cursor: isReady ? "pointer" : "not-allowed",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
