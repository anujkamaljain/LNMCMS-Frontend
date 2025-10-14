import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, time } from "motion/react";
import { useEffect } from "react";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { use } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useSelector((store) => store?.auth);
  const userId = user?._id;
  const userRole = user?.role;
  const messagesEndRef = useRef(null);

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });
    console.log(chat?.data?.messages);
    const chatMessages = chat?.data?.messages?.map((msg) => {
      const name = msg?.sender === "student" ? msg?.studentId?.name : msg?.adminId?.name;
      return {
        name: name,
        text: msg?.text,
        userRole: msg?.sender,
        timeStamp: msg?.createdAt,
      };
    });
    setMessages(chatMessages || []);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId || !targetUserId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });
    socket.on("messageReceived", ({ name, text, userRole, timeStamp }) => {
      setMessages((messages) => [
        ...messages,
        { name, text, userRole, timeStamp },
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      name: user?.name,
      userId,
      userRole,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      className="flex-1 py-3 px-2 sm:px-4 md:px-6 lg:px-8 flex justify-center items-center"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, ease: "easeIn" }}
    >
      <div
        className="
          w-full sm:w-5/6 md:w-3/4 lg:w-1/2 
          mx-auto border border-amber-400 
          m-3 sm:m-5 h-[70vh] 
          flex flex-col rounded-2xl shadow-md
          bg-black/3 backdrop-blur-sm
        "
      >
        <motion.h1
          className="
            text-xl sm:text-2xl md:text-3xl 
            border-b border-amber-400 
            text-amber-400 text-center py-3
          "
          style={{ fontFamily: "'Bowlby One SC', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          Chat
        </motion.h1>

        <div
          className="
            flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 
            space-y-2 scroll-smooth
          "
        >
          {messages.map((msg, index) => {
            return (
              <div className={`chat ${msg.userRole === userRole ? "chat-end" : "chat-start"}`} key={index}>
                <div className="chat-header">
                  {msg.name}
                  <time className="text-xs opacity-50">{msg.timeStamp}</time>
                </div>
                <div className="chat-bubble">{msg.text}</div>
                <div className="chat-footer opacity-50">{msg.userRole}</div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div
          className="
            p-3 sm:p-4 md:p-5 
            border-t border-amber-400 
            flex items-center gap-2 sm:gap-3
          "
        >
          <input
            className="
              border flex-1 rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 
              border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300
              text-sm sm:text-base
            "
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            row={1}
          />
          <button
            className="
              bg-amber-400 font-semibold 
              py-1 sm:py-2 px-3 sm:px-5 
              rounded-lg hover:bg-amber-500 active:scale-95 
              transition-all duration-150 ease-in-out
              cursor-pointer
            "
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;
