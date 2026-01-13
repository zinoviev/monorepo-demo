import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import type { Message } from "./types";

export interface ContainerHandle {
  sendMessage: (message: string) => void;
}

export interface ContainerProps {
  src: string;
  width?: number | string;
  height?: number | string;
  onReady?: () => void;
  onMessage?: (message: string) => void;
}

export const Container = forwardRef<ContainerHandle, ContainerProps>(
  function Container({ src, width = 600, height = 600, onReady, onMessage }, ref) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const isReadyRef = useRef(false);

    const sendToIframe = useCallback((msg: Message) => {
      iframeRef.current?.contentWindow?.postMessage(msg, "*");
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        sendMessage: (message: string) => {
          if (isReadyRef.current) {
            sendToIframe({ type: "message", payload: message });
          }
        },
      }),
      [sendToIframe]
    );

    useEffect(() => {
      const handleMessage = (event: MessageEvent<Message>) => {
        const data = event.data;
        if (!data || typeof data !== "object" || !("type" in data)) return;

        switch (data.type) {
          case "init":
            // Client is ready, send bootstrap confirmation
            sendToIframe({ type: "bootstrap" });
            isReadyRef.current = true;
            onReady?.();
            break;
          case "message":
            onMessage?.(data.payload);
            break;
        }
      };

      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, [sendToIframe, onReady, onMessage]);

    return (
      <iframe
        ref={iframeRef}
        src={src}
        width={width}
        height={height}
        style={{ border: "none" }}
        title="App Container"
        data-testid="app-iframe"
      />
    );
  }
);
