import { Button } from "@monorepo/ui";

export function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#f5f5f5",
        gap: "24px",
      }}
    >
      <h1 style={{ fontSize: "48px", margin: 0, color: "#1a1a1a" }}>
        Hello World
      </h1>
      <Button onClick={() => alert("Button clicked!")}>Click me</Button>
    </div>
  );
}
