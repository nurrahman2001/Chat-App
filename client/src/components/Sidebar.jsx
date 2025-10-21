import { useNavigate } from "react-router-dom";
import { RiContactsLine, RiGroupLine, RiChatUnreadLine, RiAddCircleLine, RiSettings2Line, RiMoonClearLine, } from "react-icons/ri";
import { useUser } from "../context/UserContext";
import { host } from "../utils/APIRoutes";
import { useState, useRef, useEffect } from "react";
import dummyUser from "../assets/blank_image.jpg";

const Sidebar = ({ setSelectedComponent, selectedComponent }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const baseUrl = host;
  const [showLogout, setShowLogout] = useState(false);
  const modalRef = useRef(null);

  const userAvatar = user?.avatarImage
    ? `${baseUrl}/${user.avatarImage.replace(/^\/+/, "")}`
    : dummyUser;

  const buttonClass = (name) =>
    `p-3 rounded-md transition duration-200 bg-white flex items-center justify-center w-12 h-12 
    ${selectedComponent === name
      ? "text-blue-500"
      : "text-gray-500 hover:text-blue-500 hover:bg-gray-200 focus:outline-none"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("chat-app-token");
    navigate("/login");
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowLogout(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center h-screen px-2 py-6 border-r shadow-lg bg-white justify-between relative">
      {/* Top Menu */}
      <div className="flex flex-col items-center gap-8">
        <button onClick={() => setSelectedComponent("chats")} title="Chats" className={buttonClass("chats")}>
          <RiChatUnreadLine size={24} />
        </button>
        <button onClick={() => setSelectedComponent("groups")} title="Groups" className={buttonClass("groups")}>
          <RiGroupLine size={24} />
        </button>
        <button onClick={() => setSelectedComponent("contacts")} title="Contacts" className={buttonClass("contacts")}>
          <RiContactsLine size={24} />
        </button>
        <button onClick={() => setSelectedComponent("add")} title="Add New" className={buttonClass("add")}>
          <RiAddCircleLine size={24} />
        </button>
        <button onClick={() => setSelectedComponent("settings")} title="Settings" className={buttonClass("settings")}>
          <RiSettings2Line size={24} />
        </button>
        <button
          title="Dark Mode"
          className="p-3 rounded-md transition duration-200 flex items-center justify-center w-12 h-12 text-gray-500 hover:text-blue-500 hover:bg-gray-100"
        >
          <RiMoonClearLine size={24} />
        </button>
      </div>

      {/* User profile and sign-out popup */}
      <div className="flex flex-col items-center gap-3 relative">
        <img
          src={userAvatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full cursor-pointer border-2 object-cover hover:scale-105 transition"
          onClick={() => setShowLogout(!showLogout)}
        />
        {showLogout && (
          <div
            ref={modalRef}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-whit rounded-md shadow-md"
          >
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-500 transition"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
