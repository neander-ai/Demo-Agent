import React, { useEffect, useRef, useState } from "react";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

// Component to render rrweb DOM content
function DomRendererContainer({ script, setScript }) {
  useEffect(() => {
    const fetchScript = async () => {
      try {
        const response = await fetch("/api/initial-dom-snapshot");
        const rrwebScript = await response.json();
        setScript(rrwebScript);
      } catch (error) {
        console.error("Failed to fetch or play rrweb script:", error);
      }
    };

    fetchScript();
  }, []);

  // Use script as key to force remount when script changes
  return <DomRenderer key={JSON.stringify(script)} script={script} />;
}

// Inner component that handles the player
function DomRenderer({ script }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!script || !containerRef.current) return;

    playerRef.current = new rrwebPlayer({
      target: containerRef.current,
      props: { events: script, showController: false, autoPlay: true, skipInactive: true, height: 820, width: 1450},
    });
    playerRef.current.toggleSkipInactive(false);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1f2937", // Dark background
        borderRadius: "8px",
        boxShadow:
          "0 4px 6px 0 rgba(0, 0, 0, 0.4), 0 2px 4px 0 rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
        color: "#d1d5db", // Light text for readability (if needed)
      }}
    />
  );
}

// Simple chatbox component
function ChatBox({ setScript }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Fetch initial messages from the server
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log("Fetching messages...");
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Response received");
        console.log(data);
        if (data.description) {
          setMessages(data.result.description);
          setScript(data.video_data); // Update the rrweb script with the new messages
        } // Assuming server response { messages: ["msg1", "msg2"] }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  // Handle sending a new message
  const handleSend = async () => {
    if (!input.trim()) return;
    console.log("Sending message:", input);
    setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
    setInput("");
    try {
      const response = await fetch("/api/interrupt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.result) {
        // Add the response message to the chat display
        setMessages((prevMessages) => [
          ...prevMessages,
          `GPT: ${data.result.description}`,
        ]);

        console.log("Sending message:", JSON.parse(data.result.video_data));
        setScript(JSON.parse(data.result.video_data));
      } else {
        console.error("Error sending message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #374151",
        borderRadius: "8px",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        backgroundColor: "#1f2937",
        fontFamily: "'Nunito', sans-serif",
        fontSize: "15px",
        color: "#d1d5db",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          borderBottom: "1px solid #4b5563",
          marginBottom: "10px",
          padding: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              padding: "12px",
              borderRadius: "10px",
              maxWidth: "80%",
              lineHeight: "1.6",
              backgroundColor: message.startsWith("You:")
                ? "#4b5563"
                : "#3b82f6",
              color: message.startsWith("You:") ? "#d1d5db" : "#ffffff",
              alignSelf: message.startsWith("You:") ? "flex-end" : "flex-start",
              marginBottom: "10px",
              display: "inline-block",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {message}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 14px",
            border: "1px solid #4b5563",
            borderRadius: "6px",
            fontSize: "15px",
            fontFamily: "'Nunito', sans-serif",
            backgroundColor: "#374151",
            color: "#d1d5db",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            fontSize: "15px",
            fontFamily: "'Nunito', sans-serif",
            cursor: "pointer",
            marginLeft: "10px",
            outline: "none",
          }}
        >
          Ask
        </button>
      </div>
    </div>
  );
}

// Main layout component
function Demo() {
  const [script, setScript] = useState("");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Nunito', sans-serif", // Enhanced font style
        color: "#d1d5db", // Light text for readability
        backgroundColor: "#1f2937", // Dark background
      }}
    >
      <div
        style={{
          padding: "15px 20px",
          borderBottom: "1px solid #4b5563",
          backgroundColor: "#111827", // Slightly darker for contrast
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "20px",
          fontWeight: "bold",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
        }}
      >
        <span style={{ color: "#3b82f6" }}>Neander.AI</span>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ flex: 4, padding: "20px" }}>
          <DomRendererContainer script={script} setScript={setScript} />
        </div>
        <div
          style={{
            flex: 1,
            padding: "20px",
            borderLeft: "1px solid #4b5563", // Subtle border for dark mode
            backgroundColor: "#111827", // Slightly darker sidebar for contrast
          }}
        >
          <ChatBox setScript={setScript} />
        </div>
      </div>
    </div>
  );
}

export default Demo;
