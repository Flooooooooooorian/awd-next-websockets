"use client";

import { useEffect, useState } from "react";

interface OutgoingMessage {
  event: string;
  data: unknown;
}

export default function HomePage() {
  const [messageInput, setMessageInput] = useState("");

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<unknown[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/ws");

    ws.onopen = () => {
      console.log("Connected to Backend Successfully.");
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event);
      try {
        const data = JSON.parse(event.data.toString());
        setMessages((prev) => [...prev, data]);
      } catch (e) {
        console.error("Error parsing message:", e, event.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected.");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setSocket(ws);
  }, []);

  const sendMessage = () => {
    if (socket) {
      const outgoingMessage: OutgoingMessage = {
        event: "message",
        data: messageInput,
      };

      socket.send(JSON.stringify(outgoingMessage));
    }
  };

  return (
    <div>
      <h1>Next.js WebSocket Client</h1>
      <p>Status: {socket ? "Connected" : "Disconnected"}</p>

      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
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
