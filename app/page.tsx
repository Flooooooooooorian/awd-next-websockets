"use client";

import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

interface OutgoingMessage {
  event: string;
  data: string;
}

export default function HomePage() {
  const [messageInput, setMessageInput] = useState("");

  const [messages, setMessages] = useState<unknown[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:3000/"
  );

  useEffect(() => {
    if (lastMessage !== null) {
      setMessages((prev) => [...prev, JSON.parse(lastMessage.data)]);
    }
  }, [lastMessage]);

  return (
    <div>
      <h1>Next.js WebSocket Client</h1>
      <p>Status: {readyState === 1 ? "Connected" : "Disconnected"}</p>

      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        onClick={() =>
          sendMessage(
            JSON.stringify({ event: "currywurst", data: messageInput })
          )
        }
      >
        Send
      </button>
      <h2>Latest Server Message:</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <pre>{JSON.stringify(msg, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
