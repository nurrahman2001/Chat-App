import React, { useState, useMemo, useEffect } from "react";
import { CiFileOn, CiImageOn, CiSearch } from "react-icons/ci";
import { useUser } from "../context/UserContext";
import dummyUser from "../assets/blank_image.jpg";
import { host } from "../utils/APIRoutes";

export default function ChatList({ changeChat }) {
  const { user, loading, fetchUser } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (typeof fetchUser === "function") {
      fetchUser();
    }
  }, [fetchUser]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredContacts = useMemo(() => {
    if (!user?.contacts) return [];
    return user.contacts.filter(
      (contact) =>
        contact.contactName.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm)
    );
  }, [searchTerm, user]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const formatTimeLabel = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 h-screen flex flex-col">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Chats</h2>

        {/* Search skeleton */}
        <div className="relative mb-4 bg-gray-200 rounded-md border">
          <div className="w-full h-10 rounded-md bg-gray-300 animate-pulse"></div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold mb-2">Recent</h3>

        {/* Skeleton chat list */}
        <div
          className="flex-1 overflow-y-auto space-y-4 pr-2"
          style={{ maxHeight: "calc(100vh - 150px)" }}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center p-2 bg-gray-100 rounded-md animate-pulse"
            >
              {/* Avatar skeleton */}
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>

              {/* Text skeleton */}
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <div className="w-20 sm:w-24 h-4 bg-gray-300 rounded"></div>
                  <div className="w-10 sm:w-12 h-3 bg-gray-300 rounded"></div>
                </div>
                <div className="w-28 sm:w-40 h-3 mt-2 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 bg-gray-100 h-screen flex flex-col">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Chats</h2>
      <div className="relative mb-4 bg-gray-200 rounded-md border">
        <input
          type="text"
          aria-label="Search contacts"
          role="searchbox"
          placeholder="Search by name or email"
          className="w-full p-2 pl-9 sm:pl-10 rounded-md bg-gray-200 text-sm sm:text-base focus:outline-none"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <CiSearch className="absolute left-2.5 sm:left-3 top-2.5 text-gray-500" />
      </div>

      <h3 className="text-base sm:text-lg font-semibold mb-2">Recent</h3>

      {/* Chat List */}
      <div
        className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 sm:pr-2 custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 150px)" }}
      >
        {filteredContacts.length === 0 ? (
          <p className="text-sm text-center text-gray-500">No chats found.</p>
        ) : (
          [...filteredContacts]
            .sort(
              (a, b) =>
                new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
            )
            .map((contact, index) => (
              <div
                key={contact.contactId}
                className={`flex items-center p-2 sm:p-3 cursor-pointer hover:bg-gray-200 transition duration-300 ${
                  index === currentSelected
                    ? "bg-gray-300 border-l-4 border-blue-500"
                    : "bg-gray-100"
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <img
                  src={
                    contact.avatarImage
                      ? `${host}${contact.avatarImage}`
                      : dummyUser
                  }
                  alt="avatar"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium sm:font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-[160px]">
                      {contact.contactName}
                    </h4>
                    <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                      {formatTimeLabel(contact.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {contact.lastMessage ? (
                      contact.lastMessage.startsWith("Image") ? (
                        <span className="flex items-center gap-1">
                          <CiImageOn className="text-gray-500 shrink-0" /> Image
                        </span>
                      ) : contact.lastMessage.startsWith("File") ? (
                        <span className="flex items-center gap-1">
                          <CiFileOn className="text-gray-500 shrink-0" /> File
                        </span>
                      ) : (
                        contact.lastMessage
                      )
                    ) : (
                      "No messages yet"
                    )}
                  </p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
