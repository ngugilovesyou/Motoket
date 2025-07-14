// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { Moon, Sun, SendHorizonal } from "lucide-react";
// import { AuthContext } from "../Authentication/Auth";
// import { useNavigate } from "react-router-dom";

// export default function AdminChatDashboard() {
//   const { user, isAuthenticated } = useContext(AuthContext);
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [darkMode, setDarkMode] = useState(true);
//   const navigate = useNavigate();
//   // const token=sessionStorage.getItem("access_token"); 
//   useEffect(() => {
//     // Redirect unauthenticated or non-admin users
//     if (!isAuthenticated || !user) {
//       navigate("/admin/login");
//       return;
//     }

//     axios
//       .get(`http://127.0.0.1:8000/api/${user.id}/admin_chats/`, {
//         withCredentials: true, 
//         headers: {
//           "Content-Type": "application/json", 
//         }
//       })
//       .then((res) => {
//         setChats(res.data);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch chats:", err.response?.data || err);
//       });
//   }, [isAuthenticated, user, navigate]);

//   useEffect(() => {
//     if (selectedChat) {
//       axios
//         .get(
//           `http://127.0.0.1:8000/api/chat_messages/${selectedChat.short_id}/`,
//           {
//             withCredentials: true,
//           }
//         )
//         .then((res) => setMessages(res.data));
//     }
//   }, [selectedChat]);

//   const sendMessage = () => {
//     if (!input.trim() || !selectedChat || !user?.id) return;

//     axios
//       .post(
//         "http://127.0.0.1:8000/api/send_message/",
//         {
//           sender_id: user.id,
//           chat_id: selectedChat.short_id,
//           text: input,
//         },
//         { withCredentials: true }
//       )
//       .then((res) => {
//         setMessages((prev) => [...prev, res.data.data]);
//         setInput("");
//       })
//       .catch((err) => {
//         console.error("Send message failed:", err.response?.data || err);
//       });
//   };

//   return (
//     <div
//       className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
//         darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
//       }`}
//     >
//       {/* Sidebar */}
//       <div className="md:w-1/3 lg:w-1/4 border-r border-gray-700 p-4 space-y-4">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-bold">Admin Inbox</h2>
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="p-2 rounded-full hover:bg-gray-700"
//           >
//             {darkMode ? (
//               <Sun className="w-5 h-5" />
//             ) : (
//               <Moon className="w-5 h-5" />
//             )}
//           </button>
//         </div>

//         <div className="space-y-2 overflow-y-auto max-h-[80vh]">
//           {chats.map((chat) => (
//             <button
//               key={chat.short_id}
//               onClick={() => setSelectedChat(chat)}
//               className={`block w-full text-left px-4 py-2 rounded-lg transition ${
//                 selectedChat?.short_id === chat.short_id
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-800 hover:bg-gray-700"
//               }`}
//             >
//               Chat with {chat.initiator || "User"}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chat Window */}
//       <div className="flex-1 p-4 flex flex-col justify-between">
//         {selectedChat ? (
//           <>
//             <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-gray-800 rounded-lg">
//               {messages.map((msg, i) => (
//                 <div
//                   key={i}
//                   className={`p-3 max-w-[75%] rounded-lg ${
//                     msg.sender === user.username
//                       ? "bg-blue-600 text-white ml-auto"
//                       : "bg-gray-700 text-gray-100"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//               ))}
//             </div>

//             <div className="mt-4 flex items-center gap-2">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
//                 placeholder="Type a reply..."
//               />
//               <button
//                 onClick={sendMessage}
//                 className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
//               >
//                 <SendHorizonal className="w-4 h-4" />
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="text-center text-gray-400">
//             Select a chat to start messaging
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { Moon, Sun, SendHorizonal } from "lucide-react";
import { AuthContext } from "../Authentication/Auth";
import { useNavigate } from "react-router-dom";

export default function AdminChatDashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/admin/login");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/${user.id}/admin_chats/`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => setChats(res.data))
      .catch((err) =>
        console.error("Failed to fetch chats:", err.response?.data || err)
      );
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (selectedChat) {
      axios
        .get(
          `http://127.0.0.1:8000/api/chat_messages/${selectedChat.short_id}/`,
          {
            withCredentials: true,
          }
        )
        .then((res) => setMessages(res.data));
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !selectedChat || !user?.id) return;

    axios
      .post(
        "http://127.0.0.1:8000/api/send_message/",
        {
          sender_id: user.id,
          chat_id: selectedChat.short_id,
          text: input,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setMessages((prev) => [...prev, res.data.data]);
        setInput("");
      })
      .catch((err) => {
        console.error("Send message failed:", err.response?.data || err);
      });
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <div className="md:w-1/3 lg:w-1/4 border-r border-gray-700 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Admin Inbox</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto max-h-[80vh]">
          {chats.map((chat) => (
            <button
              key={chat.short_id}
              onClick={() => setSelectedChat(chat)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                selectedChat?.short_id === chat.short_id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
             {chat.initiator || "User"}-{chat.vehicle.slug}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {selectedChat ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-gray-800 rounded-lg">
              {messages.map((msg, i) => {
                 const isAdmin = msg.sender_id == user.id;
                return (
                  <div
                    key={i}
                    className={`flex ${
                      isAdmin ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm shadow-sm ${
                        isAdmin
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-700 text-gray-100 rounded-bl-none"
                      }`}
                    >
                      <div
                        className={`text-xs mb-1 font-medium ${
                          isAdmin ? "text-blue-200 text-right" : "text-gray-400"
                        }`}
                      >
                        {isAdmin ? "You" : msg.sender_name || "User"}
                      </div>
                      <div>{msg.text}</div>
                      {msg.created_at && (
                        <div className="text-[10px] text-gray-50 mt-1 text-right">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
                placeholder="Type a reply..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                <SendHorizonal className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}