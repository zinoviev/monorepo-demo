import type { Message } from "./types";

type ReadyCallback = () => void;
type MessageCallback = (message: string) => void;

const readyCallbacks: ReadyCallback[] = [];
const messageCallbacks: MessageCallback[] = [];
let isReady = false;

// Send init message to host when script loads
function sendToHost(msg: Message) {
  window.parent.postMessage(msg, "*");
}

// Listen for messages from host
window.addEventListener("message", (event: MessageEvent<Message>) => {
  const data = event.data;
  if (!data || typeof data !== "object" || !("type" in data)) return;

  switch (data.type) {
    case "bootstrap":
      isReady = true;
      readyCallbacks.forEach((cb) => cb());
      break;
    case "message":
      messageCallbacks.forEach((cb) => cb(data.payload));
      break;
  }
});

// Send init message to host
sendToHost({ type: "init" });

export const context = {
  /**
   * Register a callback to be called when the host confirms the connection.
   * Returns an unsubscribe function.
   */
  onReady: (callback: ReadyCallback): (() => void) => {
    if (isReady) {
      callback();
    } else {
      readyCallbacks.push(callback);
    }
    return () => {
      const index = readyCallbacks.indexOf(callback);
      if (index > -1) {
        readyCallbacks.splice(index, 1);
      }
    };
  },

  /**
   * Register a callback to be called when a message is received from the host.
   * Returns an unsubscribe function.
   */
  onMessage: (callback: MessageCallback): (() => void) => {
    messageCallbacks.push(callback);
    return () => {
      const index = messageCallbacks.indexOf(callback);
      if (index > -1) {
        messageCallbacks.splice(index, 1);
      }
    };
  },

  /**
   * Send a chat message to the host
   */
  chatMessage: (message: string): void => {
    sendToHost({ type: "message", payload: message });
  },
};
