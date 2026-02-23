import React, { useEffect, useRef, useState } from "react";
import { Shield, SendHorizonal } from "lucide-react";
import axios from "axios";

const ContactSellerChat = ({ vehicle, currentUser }) => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const token=sessionStorage.getItem("access_token");
  // =========================
  // 1️⃣ Create or get the chat
  // =========================
  useEffect(() => {
    if (!currentUser?.id) return;

    axios
      .post(
        "https://motoketapi.onrender.com/api/create_chat/",
        { buyer_id: currentUser.id, vehicle_id: vehicle.id },
        { withCredentials: true }
      )
      .then((res) => {
        const chat = res.data.data;
        setChatId(chat.short_id);
        console.log(" the chat id is", chat.short_id);
        setMessages(chat.messages || []);
        setInput("");
      })
      .catch((err) => {
        console.error(
          "Failed to create/get chat:",
          err.response?.data || err.message
        );
      });
  }, [currentUser?.id]);

  // =========================
  // 2️⃣ Connect WebSocket
  // =========================
  useEffect(() => {
    // console.log("Token being sent:", token);
    if (!chatId || !token) return;

  const ws = new WebSocket(
  `wss://motoketapi.onrender.com/ws/chat/${chatId}/?token=${encodeURIComponent(token)}`
);


    ws.onopen = () => {
      console.log("WebSocket connected!");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);

    ws.onclose = (e) => {
      console.log("WebSocket closed, attempting reconnect...", e.reason);
      setConnected(false);
      // Auto-reconnect after 2 seconds
      setTimeout(() => {
        if (chatId && token) {
          setSocket(null); // trigger re-connect
        }
      }, 2000);
    };

    setSocket(ws);

    return () => ws.close();
  }, [chatId, token]);

  // =========================
  // 3️⃣ Auto scroll to bottom
  // =========================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // =========================
  // 4️⃣ Send message
  // =========================
  const sendMessage = () => {
    if (!input.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(
      JSON.stringify({
        message: input,
        sender_id: currentUser.id,
      })
    );

    setInput("");
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 sticky top-6">
      <h3 className="text-xl font-bold mb-4">Chat with Seller</h3>

      {/* Seller info */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          S
        </div>
        <div>
          <div className="font-semibold">Seller</div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto bg-gray-800 rounded-lg p-3 mb-3 space-y-2">
        {messages.map((msg, i) => {
          const isCurrentUser =
            msg.sender === currentUser.first_name ||
            msg.sender?.id === currentUser.id ||
            msg.sender_id === currentUser.id;

          return (
            <div
              key={i}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm shadow-sm ${
                  isCurrentUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {!isCurrentUser && (
                  <div className="text-xs text-gray-400 mb-1 font-medium">Seller</div>
                )}
                {isCurrentUser && (
                  <div className="text-xs text-blue-200 mb-1 font-medium text-right">You</div>
                )}
                <div>{msg.message || msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none"
          placeholder={connected ? "Type your message..." : "Login to chat..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!connected}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 disabled:opacity-50"
          type="button"
          disabled={!connected || !input.trim()}
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Shield className="w-4 h-4" />
          <span>Verified admin • Secure support</span>
        </div>
      </div>
    </div>
  );
};

export default ContactSellerChat;
