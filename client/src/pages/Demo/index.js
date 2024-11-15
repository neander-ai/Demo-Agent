import React, { useEffect, useRef, useState } from "react";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

// Component to render rrweb DOM content
function DomRendererContainer({script, setScript}) {
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
    props: { events: script }
  });
  playerRef.current.toggleSkipInactive(false);
}, []); // Only run once on mount since we remount on script changes

return (
  <div
    ref={containerRef}
    style={{
      border: "1px solid black",
      padding: "10px",
      height: "100%",
      overflow: "auto",
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
    <div style={{ border: "1px solid gray", padding: "10px", height: "100%" }}>
      <div
        style={{
          height: "80%",
          overflowY: "auto",
          marginBottom: "10px",
          borderBottom: "1px solid lightgray",
        }}
      >
        {messages.map((message, index) => (
          <div key={index} style={{ padding: "5px 0" }}>
            {message}
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, marginRight: "5px" }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

// Main layout component
function Demo() {
  const [script, setScript] = useState("");
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 3, padding: "10px" }}>
        <DomRendererContainer script={script} setScript={setScript} />
      </div>
      <div
        style={{ flex: 1, padding: "10px", borderLeft: "1px solid lightgray" }}
      >
        <ChatBox setScript={setScript} />
      </div>
    </div>
  );
}

export default Demo;
