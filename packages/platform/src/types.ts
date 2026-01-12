// Message types for communication between platform (host) and client (iframe)
export type Message =
  | { type: "init" }
  | { type: "bootstrap" }
  | { type: "message"; payload: string };
