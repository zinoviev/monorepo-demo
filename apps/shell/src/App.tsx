import { useState, useRef, useCallback } from "react";
import { Container, ContainerHandle } from "@zinovev.iv/monorepo-demo-platform";

interface ChatMessage {
  id: number;
  text: string;
  from: "shell" | "app";
}

export function App() {
  const containerRef = useRef<ContainerHandle>(null);
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const handleMessage = useCallback((message: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: message, from: "app" },
    ]);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim() || !isReady) return;

    const message = inputValue.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: message, from: "shell" },
    ]);
    containerRef.current?.sendMessage(message);
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
        display: "flex",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Shell Chat Panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <h2 style={{ margin: "0 0 8px 0", color: "#1a1a1a" }}>Shell Chat</h2>

        {/* Status indicator */}
        <div
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
          <span style={{ fontSize: "14px", color: "#666" }}>
            {isReady ? "Connected" : "Initializing..."}
          </span>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            border: "1px solid #e0e0e0",
          }}
        >
          {messages.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center" }}>
              No messages yet
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: "8px 12px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  backgroundColor: msg.from === "shell" ? "#3b82f6" : "#e5e7eb",
                  color: msg.from === "shell" ? "#fff" : "#1a1a1a",
                  alignSelf: msg.from === "shell" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  marginLeft: msg.from === "shell" ? "auto" : "0",
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
                  {msg.from === "shell" ? "Shell" : "App"}
                </span>
                {msg.text}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: "8px" }}>
          <input
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
              border: "1px solid #e0e0e0",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!isReady || !inputValue.trim()}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: isReady ? "#3b82f6" : "#ccc",
              color: "#fff",
              fontSize: "14px",
              cursor: isReady ? "pointer" : "not-allowed",
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* App iframe Panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <h2 style={{ margin: "0 0 16px 0", color: "#1a1a1a" }}>App</h2>
        <Container
          ref={containerRef}
          src="http://localhost:5174"
          width="100%"
          height={500}
          onReady={handleReady}
          onMessage={handleMessage}
        />
      </div>
    </div>
  );
}
