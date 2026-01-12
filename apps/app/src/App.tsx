import { Button } from "@monorepo/ui";

export function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#7c3aed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        gap: "24px",
      }}
    >
      <h1 style={{ fontSize: "48px", margin: 0, color: "white" }}>
        this is app
      </h1>
      <Button onClick={() => alert("Clicked!")}>Button from UI</Button>
    </div>
  );
}
