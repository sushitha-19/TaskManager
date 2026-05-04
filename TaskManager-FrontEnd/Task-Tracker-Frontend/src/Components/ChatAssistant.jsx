import { useState } from "react";

function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          userId: user.id,
        }),
      });

      const data = await res.text();

      const botMsg = { sender: "bot", text: data };
      setChat((prev) => [...prev, botMsg]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Server error 😓" },
      ]);
    }

    setMessage("");
  };

  return (
  <>
    {/* ✅ SHOW BUTTON ONLY WHEN CLOSED */}
    {!isOpen && (
      <div className="chat-toggle" onClick={() => setIsOpen(true)}>
        💬
      </div>
    )}

    {/* ✅ SHOW CHAT ONLY WHEN OPEN */}
    {isOpen && (
      <div className="chat-box">
        <h3>
          AI Assistant 🤖
          <span
            className="close-btn"
            onClick={() => setIsOpen(false)}
          >
            ✖
          </span>
        </h3>

        <div className="chat-messages">
          {chat.map((msg, i) => (
            <div key={i} className={`msg ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your tasks..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    )}
  </>
);
}

export default ChatAssistant;