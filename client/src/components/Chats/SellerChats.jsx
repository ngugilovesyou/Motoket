import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { SendHorizonal, ArrowLeft, MessageCircle } from "lucide-react";
import { AuthContext } from "../Authentication/Auth";

const SellerChats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get("http://127.0.0.1:8000/api/seller_chats/", {
        params: { user_id: user.id },
        withCredentials: true,
      })
      .then((res) => {
        setChats(res.data.data);
      })
      .catch((err) => console.error("Failed to fetch chats:", err));
  }, [user?.id]);

  useEffect(() => {
    if (!selectedChat) return;
    axios
      .get(`http://127.0.0.1:8000/api/chat_messages/${selectedChat.short_id}/`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data.data || []))
      .catch((err) => console.error("Failed to load messages:", err));
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !selectedChat) return;
    axios
      .post(
        "http://127.0.0.1:8000/api/send_message/",
        { chat_id: selectedChat.short_id, text: input, sender_id: user.id },
        { withCredentials: true }
      )
      .then((res) => {
        setMessages((prev) => [...prev, res.data.data]);
        setInput("");
      })
      .catch((err) =>
        console.error("Message send error:", err.response?.data || err.message)
      );
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // On mobile, hide sidebar when chat is selected
    setShowSidebar(false);
  };

  const handleBack = () => {
    setShowSidebar(true);
    setSelectedChat(null);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return String(name).charAt(0).toUpperCase();
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.slice(11, 16);
  };

  return (
    <div className="dark flex min-h-screen shadow-2xl  overflow-hidden border  font-sans">
      {/* Sidebar */}
      <div
        className={`
          ${showSidebar ? "flex" : "hidden"} md:flex
          w-full md:w-[340px] flex-shrink-0
          flex-col bg-gray-900 border-r border-gray-700/50
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-gray-900 font-bold text-sm">
              {getInitials(user?.first_name || user?.username)}
            </div>
            <h2 className="text-white font-semibold text-base">My Chats</h2>
          </div>
          <MessageCircle className="w-5 h-5 text-yellow-500" />
        </div>

        {/* Search bar (decorative) */}
        <div className="px-3 py-2 bg-gray-900">
          <div className="bg-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-400 text-sm">Search or start new chat</span>
          </div>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 && (
            <div className="p-6 text-gray-500 text-center text-sm">No chats yet</div>
          )}
          {chats.map((chat, index) => (
            <div
              key={chat.id}
              className={`
                flex items-center gap-3 px-4 py-3 cursor-pointer
                border-b border-gray-800
                transition-colors duration-150
                ${selectedChat?.id === chat.id
                  ? "bg-gray-700"
                  : "hover:bg-gray-800"
                }
              `}
              onClick={() => handleSelectChat(chat)}
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-gray-900 font-bold text-lg flex-shrink-0">
                {getInitials(chat.initiator?.first_name || chat.initiator)}
              </div>
              {/* Chat info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-white font-medium text-sm truncate">
                    {chat.initiator?.first_name || chat.initiator || "User"}
                  </span>
                  <span className="text-yellow-500/80 text-xs flex-shrink-0 ml-2">
                    {formatTime(chat.updated_at)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs truncate mt-0.5">
                  {chat.messages?.[0]?.text ?? "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`
          ${!showSidebar ? "flex" : "hidden"} md:flex
          flex-1 flex-col
          bg-gray-900
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 border-b border-gray-700/50 flex-shrink-0">
          {/* Back button - mobile only */}
          <button
            className="md:hidden text-yellow-500 p-1 -ml-1"
            onClick={handleBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {selectedChat ? (
            <>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-gray-900 font-bold">
                {getInitials(selectedChat.initiator?.first_name || selectedChat.initiator)}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">
                  {selectedChat.initiator?.first_name || selectedChat.initiator || "User"}
                </div>
                <div className="text-yellow-500/70 text-xs">online</div>
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-sm hidden md:block">Select a chat</div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {!selectedChat ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-yellow-500/50" />
              </div>
              <p className="text-gray-500 text-sm">Select a chat to start messaging</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">No messages yet. Say hi! 👋</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isUser = msg.sender_id === user.id;
              const showDate = i === 0 || messages[i - 1]?.created_at?.slice(0, 10) !== msg.created_at?.slice(0, 10);

              return (
                <React.Fragment key={i}>
                  {showDate && msg.created_at && (
                    <div className="flex justify-center my-2">
                      <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-1`}>
                    <div
                      className={`
                        relative max-w-[75%] md:max-w-[60%] px-3 py-2 rounded-2xl text-sm shadow
                        ${isUser
                          ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-gray-900 rounded-br-sm"
                          : "bg-gray-700 text-gray-100 rounded-bl-sm"
                        }
                      `}
                    >
                      {!isUser && (
                        <div className="text-yellow-400 text-xs font-semibold mb-0.5">
                          {selectedChat.initiator?.first_name || selectedChat.initiator}
                        </div>
                      )}
                      <p className="leading-relaxed break-words">{msg.text}</p>
                      <div className={`text-right mt-0.5 text-xs ${isUser ? "text-gray-800/70" : "text-gray-400"}`}>
                        {formatTime(msg.created_at)}
                        {isUser && (
                          <span className="ml-1">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedChat && (
          <div className="px-3 py-3 bg-gray-800 border-t border-gray-700/50 flex items-center gap-2 flex-shrink-0">
            {/* Emoji button */}
            <button className="text-gray-400 hover:text-yellow-500 transition-colors p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <input
              type="text"
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              placeholder="Type a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                ${input.trim()
                  ? "bg-gradient-to-br from-yellow-500 to-yellow-600 text-gray-900 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 scale-100 hover:scale-105"
                  : "bg-gray-700 text-gray-400"
                }
              `}
              onClick={sendMessage}
            >
              <SendHorizonal className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerChats;