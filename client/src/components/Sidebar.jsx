import React from "react";
import {
  RiContactsLine,
  RiGroupLine,
  RiChatUnreadLine,
  RiAddCircleLine,
  RiSettings2Line,
  RiMoonClearLine,
} from "react-icons/ri";
import blank_image from "../assets/blank_image.jpg";
import { useUser } from "../context/UserContext";

const Sidebar = ({ setSelectedComponent, selectedComponent }) => {
  const { user } = useUser();
  const baseUrl = "http://localhost:5000";
  const userAvatar = user?.avatarImage
    ? `${baseUrl}/${user.avatarImage.replace(/^\/+/, "")}`
    : blank_image;

  const buttonClass = (name) =>
    `p-3 rounded-md transition bg-transparent duration-200 flex items-center justify-center w-12 h-12 
    ${selectedComponent === name
      ? "text-blue-500 bg-gray-200"
      : "text-gray-500 hover:text-blue-500 hover:bg-gray-200  focus:outline-none"
    }`;

  return (
    <div className="flex flex-col items-center h-screen px-2 py-6 border-r shadow-lg bg-white justify-between">
      <div className="flex flex-col items-center gap-8">
        <button
          onClick={() => setSelectedComponent("chats")}
          title="Chats"
          className={buttonClass("chats")}
        >
          <RiChatUnreadLine size={24} />
        </button>
        <button
          onClick={() => setSelectedComponent("groups")}
          title="Groups"
          className={buttonClass("groups")}
        >
          <RiGroupLine size={24} />
        </button>
        <button
          onClick={() => setSelectedComponent("contacts")}
          title="Contacts"
          className={buttonClass("contacts")}
        >
          <RiContactsLine size={24} />
        </button>
        <button
          onClick={() => setSelectedComponent("add")}
          title="Add New"
          className={buttonClass("add")}
        >
          <RiAddCircleLine size={24} />
        </button>
        <button
          onClick={() => setSelectedComponent("settings")}
          title="Settings"
          className={buttonClass("settings")}
        >
          <RiSettings2Line size={24} />
        </button>
        <button
          title="Dark Mode"
          className="p-3 rounded-md transition duration-200 flex items-center justify-center w-12 h-12 text-gray-500 hover:text-blue-500 hover:bg-gray-100"
        >
          <RiMoonClearLine size={24} />
        </button>
      </div>

      {/* User profile at the bottom */}
      <div className="flex flex-col items-center">
        <img
          src={userAvatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full cursor-pointer object-cover"
        />
      </div>
    </div>
  );
};

export default Sidebar;
