/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { Shield, SendHorizonal } from "lucide-react";
import axios from "axios";

const ContactSellerChat = ({ vehicle, currentUser }) => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // useEffect(() => {
  //   // Step 1: Fetch or create the chat
  //   axios
  //     .get("http://127.0.0.1:8000/api/get_chats/", { withCredentials: true })
  //     .then((res) => {
  //       const chat = res.data.data;
  //       console.log("the short-id of the chat is: ", chat);
  //       setChatId(chat.short_id);

  //       // Step 2: Join chat with seller as acceptor
  //       axios
  //         .post(
  //           "http://127.0.0.1:8000/api/join_chat/",
  //           {
  //             chat_id: chat.short_id,
  //           },
  //           { withCredentials: true }
  //         )
  //         .catch(() => {});

  //       // Step 3: Load messages
  //       setMessages(chat.messages || []);
  //     });
  // }, [vehicle.owner_id]);
  useEffect(() => {
    if (!currentUser?.id) return;

    axios
      .post(
        "http://127.0.0.1:8000/api/create_chat/",
        { buyer_id: currentUser.id, vehicle_id:vehicle.id },

        { withCredentials: true }
      )
      .then((res) => {
        const chat = res.data.data;
        console.log("Chat with admin:", chat);
        setChatId(chat.short_id);
        setMessages(chat.messages || []);
      })
      .catch((err) => {
        console.error(
          "Failed to create/get admin chat:",
          err.response?.data || err.message
        );
      });
  }, [currentUser?.id]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const sendMessage = () => {
    if (!input.trim() || !chatId) return;

    axios
      .post(
        "http://127.0.0.1:8000/api/send_message/",
        {
          sender_id: currentUser.id,
          text: input,
          chat_id: chatId,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setMessages((prev) => [...prev, res.data.data]);
        setInput("");
      })
      .catch((err) => {
        console.error("Message send error:", err.response?.data || err.message);
      });
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 sticky top-6">
      <h3 className="text-xl font-bold mb-4">Chat with Seller</h3>

      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          S
        </div>
        <div>
          <div className="font-semibold">Seller</div>
        </div>
      </div>

      <div className="h-64 overflow-y-auto bg-gray-800 rounded-lg p-3 mb-3 space-y-2">
        {messages.map((msg, i) => {
          const isCurrentUser =
            msg.sender === currentUser.first_name ||
            msg.sender?.id === currentUser.id ||
            msg.sender_id === currentUser.id;

          return (
            <div
              key={i}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm shadow-sm ${
                  isCurrentUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {!isCurrentUser && (
                  <div className="text-xs text-gray-400 mb-1 font-medium">
                    Seller
                  </div>
                )}
                {isCurrentUser && (
                  <div className="text-xs text-blue-200 mb-1 font-medium text-right">
                    You
                  </div>
                )}
                <div>{msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
          type="button"
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>

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
