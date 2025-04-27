import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatInput from "./ChatInput";
import CurrentUserDetails from "./CurrentUserDetails";
import ChatHeader from "./ChatHeader";
import MessageContainer from "./MessageContainer";
import {
  getAllMessagesRoute,
  sendMessageRoute,
  deleteMessageRoute,
} from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, currentUser, socket, isOnline }) {

  const [messages, setMessages] = useState([]);
  const [isMessageDeleted, setIsMessageDeleted] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState("");
  const [isTypingFromOtherUser, setIsTypingFromOtherUser] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenCallModal = (type) => {
    setCallType(type);
    setIsCallModalOpen(true);
  };

  // Message Handlers 
  const handleSendMsg = async (msg) => {
    if (!msg) return;

    await axios.post(sendMessageRoute, {
      from: currentUser.userId,
      to: currentChat.userId,
      message: msg,
    });

    socket.current.emit("send-msg", {
      from: currentUser.userId,
      to: currentChat.userId,
      message: msg,
    });

    setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
  };

  const handleSendFile = async (file, msg = "") => {
    try {
      const formData = new FormData();
      formData.append("from", currentUser.userId);
      formData.append("to", currentChat.userId);
      formData.append("file", file);
      if (msg.trim()) formData.append("message", msg);

      const response = await axios.post(sendMessageRoute, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      socket.current.emit("send-msg", {
        from: currentUser.userId,
        to: currentChat.userId,
        message: msg || "",
        fileUrl: response.data.fileUrl,
        fileType: file.type,
      });

      setMessages((prev) => [
        ...prev,
        {
          fromSelf: true,
          message: "",
          fileUrl: response.data.fileUrl,
          fileType: file.type,
        },
      ]);
    } catch (err) {
      console.error("Failed to send file:", err);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await axios.post(`${deleteMessageRoute}/${messageId}`);
      if (response.status === 200) {
        setMessages((prev) => prev.filter((msg) => msg.messageId !== messageId));
        setIsMessageDeleted(true);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    await deleteMessage(messageId);
    setIsMessageDeleted(true);
    setActiveModalIndex(null);
  };

  // Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser || !currentChat) return;

      const { data } = await axios.post(getAllMessagesRoute, {
        from: currentUser.userId,
        to: currentChat.userId,
      });

      setMessages(data);
    };

    fetchMessages();
  }, [currentUser, currentChat]);

  // Socket Event Listeners
  useEffect(() => {
    if (!socket.current) return;

    const currentSocket = socket.current;

    const handleMessageReceive = (msg) => {
      if (msg.from === currentChat.userId) {
        setMessages((prev) => [
          ...prev,
          {
            fromSelf: false,
            message: msg.message,
            fileUrl: msg.fileUrl,
            fileType: msg.fileType,
          },
        ]);
      }
    };

    currentSocket.on("msg-recieve", handleMessageReceive);
    return () => currentSocket.off("msg-recieve", handleMessageReceive);
  }, [socket, currentChat]);

  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("typing", ({ from }) => {
      if (from === currentChat.userId) setIsTypingFromOtherUser(true);
    });

    socket.current.on("stop-typing", ({ from }) => {
      if (from === currentChat.userId) setIsTypingFromOtherUser(false);
    });
  }, [currentChat]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);
-
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeModalIndex !== null && !event.target.closest(".message-action-modal")) {
        setActiveModalIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeModalIndex]);

  if (!currentChat) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Select a contact to start chatting.
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-white overflow-hidden flex flex-col">
      <ChatHeader
        currentChat={currentChat}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
        handleOpenCallModal={handleOpenCallModal}
        setIsSidebarOpen={setIsSidebarOpen}
        isCallModalOpen={isCallModalOpen}
        setIsCallModalOpen={setIsCallModalOpen}
        callType={callType}
        socket={socket}
        isOnline={isOnline}
      />

      <MessageContainer
        messages={messages}
        isMessageDeleted={isMessageDeleted}
        isOnline={isOnline}
        scrollRef={scrollRef}
        activeModalIndex={activeModalIndex}
        setActiveModalIndex={setActiveModalIndex}
        showScrollBtn={showScrollBtn}
        setShowScrollBtn={setShowScrollBtn}
        scrollToBottom={scrollToBottom}
        handleDeleteMessage={handleDeleteMessage}
        isTypingFromOtherUser={isTypingFromOtherUser}
      />

      {/* Input */}
      <div className="fixed bottom-0 max-w-[71%] w-full bg-white border-t shadow-md z-10 px-4 py-2">
        <ChatInput handleSendMsg={handleSendMsg} handleSendFile={handleSendFile} />
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <CurrentUserDetails
          currentChat={currentChat}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
