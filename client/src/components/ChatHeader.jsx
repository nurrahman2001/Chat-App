import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RiPhoneLine, RiSearchLine, RiUserLine, RiVideoOnLine, } from "react-icons/ri";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { FaTimes, } from "react-icons/fa";
import { host } from "../utils/APIRoutes";
import dummyUser from "../assets/blank_image.jpg";

export default function ChatHeader({
    currentChat,
    showSearch,
    setShowSearch,
    handleOpenCallModal,
    setIsSidebarOpen,
    isSidebarOpen,
    isCallModalOpen,
    setIsCallModalOpen,
    callType,
    isOnline

}) {
    const [isEllipsisOpen, setIsEllipsisOpen] = useState(false);
    const navigate = useNavigate();
    const ellipsisRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ellipsisRef.current && !ellipsisRef.current.contains(event.target)) {
                setIsEllipsisOpen(false);
            }
        };

        if (isEllipsisOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEllipsisOpen]);



    const handleOpenEllipsis = () => {
        setIsEllipsisOpen((prev) => !prev);
        if (isEllipsisOpen) {
            setIsEllipsisOpen(false);
        }
    };

    // const handleLougout = () => {
    //     localStorage.removeItem("chat-app-token");
    //     navigate("/login");
    // };

    if (!currentChat) return null;

    return (
        <>
            {/* Header */}
            <div className="flex fixed max-w-[71%] w-full justify-between items-center border-b px-6 py-4 bg-white  z-10">
                <div className="flex items-center gap-3">
                    <img
                        src={
                            currentChat.avatarImage
                                ? `${host}${currentChat.avatarImage}`
                                : dummyUser
                        }
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex items-center gap-1">
                        <h3 className="text-lg font-semibold">
                            {currentChat.contactName}
                        </h3>
                        {
                            isOnline ? (
                                <span className="text-green-500  text-[0.6rem] mt-1">Online</span>
                            ) : (
                                null
                            )
                        }

                    </div>
                </div>
                <div className="flex items-center gap-10 text-gray-500">
                    <RiSearchLine
                        size={20}
                        className="cursor-pointer hover:text-gray-700"
                        onClick={() => setShowSearch((prev) => !prev)}
                    />
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="Search within chat"
                            className="border px-2 py-1 rounded-md outline-none"
                        />
                    )}
                    <RiPhoneLine
                        size={20}
                        className="cursor-pointer hover:text-gray-700"
                        onClick={() => handleOpenCallModal("audio")}
                    />
                    <RiVideoOnLine
                        size={20}
                        className="cursor-pointer hover:text-gray-700"
                        onClick={() => handleOpenCallModal("video")}
                    />
                    <RiUserLine
                        size={20}
                        className="cursor-pointer hover:text-gray-700"
                        onClick={() => setIsSidebarOpen(true)}
                    />
                    <IoEllipsisHorizontalSharp
                        size={20}
                        className="cursor-pointer hover:text-gray-700"
                        onClick={handleOpenEllipsis}
                    />
                </div>
            </div>
            {/* Ellipsis Menu */}
            {isEllipsisOpen && (
                <div
                    ref={ellipsisRef}
                    className="absolute right-0 z-10 top-16 bg-white rounded shadow-lg py-2 text-sm w-32"
                >
                    <div className="flex flex-col">
                        <button className="bg-white text-left px-4 py-2 ">Delete</button>
                        <button className="bg-white text-left px-4 py-2 ">Mute</button>
                        <button className="bg-white text-left px-4 py-2" >Clear All</button>
                    </div>
                </div>
            )}


            {/* Call Modal */}
            <div
                className={`fixed inset-0 flex items-center justify-center z-20 transition-all duration-300 ease-in-out
                  ${isCallModalOpen ? "opacity-100 visible bg-black bg-opacity-50" : "opacity-0 invisible pointer-events-none bg-transparent"}`}
            >
                <div
                    className={`bg-white p-10 rounded-lg shadow-lg text-center w-80 transform transition-transform duration-300 ease-in-out
                     ${isCallModalOpen ? "scale-100" : "scale-95"}`}
                >
                    <img
                        src={
                            currentChat.avatarImage
                                ? `${host}${currentChat.avatarImage}`
                                : dummyUser
                        }
                        alt="avatar"
                        className="w-16 h-16 rounded-full mx-auto mb-3"
                    />
                    <h3 className="text-xl font-semibold">{currentChat.contactName}</h3>
                    <p className="text-gray-500">
                        {callType === "audio" ? "Start Audio Call" : "Start Video Call"}
                    </p>
                    <div className="flex justify-center gap-5 mt-4">
                        <button
                            onClick={() => setIsCallModalOpen(false)}
                            className="bg-red-500 p-3 rounded-full text-white hover:bg-red-700 border-none outline-none focus:outline-none"
                        >
                            <FaTimes size={20} />
                        </button>
                        <button
                            onClick={() =>
                                navigate("/call", {
                                    state: {
                                        currentChat,
                                        callType,
                                    },
                                })
                            }
                            className="bg-green-500 p-3 rounded-full text-white hover:bg-green-700 border-none outline-none focus:outline-none"
                        >
                            {
                                callType === "audio" ? (
                                    <RiPhoneLine size={20} />
                                ) : (
                                    <RiVideoOnLine size={20} />
                                )
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* User Details Sidebar */}
            <div
                className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-30 transition-all duration-300 ease-in-out transform
                 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-4 flex flex-col gap-2">
                    <h2 className="text-xl font-bold mb-4">User Info</h2>
                    <button
                        className="self-end text-gray-500 hover:text-red-500"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>
        </>
    );
}
