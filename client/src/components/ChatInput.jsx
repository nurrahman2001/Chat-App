import React, { useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { AiOutlinePaperClip, AiOutlineClose } from "react-icons/ai";

export default function ChatInput({ handleSendMsg, handleSendFile, socket, currentChat, currentUser }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [msg, setMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const emojiRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMsg((prev) => prev + emoji.emoji);
  };

  const emitTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.current?.emit("typing", {
        to: currentChat.userId,
        from: currentUser.userId,
      });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.current?.emit("stop-typing", {
        to: currentChat.userId,
        from: currentUser.userId,
      });
    }, 1000);
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
    emitTyping();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleMessageSend();
    }
  };

  const handleMessageSend = () => {
    if (msg.trim() || selectedFile) {
      if (selectedFile) {
        handleSendFile(selectedFile, msg);
        setSelectedFile(null);
        setFilePreview(null);
      } else {
        handleSendMsg(msg);
      }

      setMsg("");
      setIsTyping(false);
      socket.current?.emit("stop-typing", {
        to: currentChat.userId,
        from: currentUser.userId,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      e.target.value = "";
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleMessageSend();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="flex items-center p-4">
      <div className="flex items-center space-x-3">
        <div className="relative text-gray-600 cursor-pointer" ref={emojiRef}>
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} className="text-2xl" />
          {showEmojiPicker && (
            <div
              className="absolute bottom-12 left-0 bg-white shadow-lg border rounded-lg z-10"
              style={{ transform: "scale(0.8)", transformOrigin: "bottom left" }}
            >
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        <label htmlFor="file-upload" className="cursor-pointer text-gray-600">
          <AiOutlinePaperClip className="text-2xl" />
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {filePreview && (
        <div className="absolute bottom-20 flex items-center justify-center w-20 h-20 rounded-md bg-white shadow-lg p-1">
          <img
            src={filePreview}
            alt="file preview"
            className="max-w-full max-h-full object-contain rounded-md"
          />
          <button
            onClick={() => {
              setSelectedFile(null);
              setFilePreview(null);
            }}
            className="absolute -top-7 -right-4 bg-transparent  text-gray-800 hover:text-gray-700 flex items-center justify-center border-none outline-none focus:outline-none"
            title="Remove">
            <AiOutlineClose size={18} />
          </button>
        </div>
      )}

      <form className="flex flex-1  rounded-full pl-4 ml-3" onSubmit={handleFormSubmit}>
        <textarea
          rows={1}
          placeholder="Type your message..."
          value={msg}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          className="flex-1 bg-gray-300 text-gray-800 rounded-md border-none focus:outline-none p-2 resize-none custom-scrollbar"
        />

        <button type="submit" className="bg-purple-500 px-3 rounded-md flex items-center justify-center mx-2 outline-none focus:outline-none">
          <IoMdSend className="text-white text-xl" />
        </button>
      </form>
    </div>
  );
}
