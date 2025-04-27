import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import dummyUser from "../assets/blank_image.jpg";
import { host } from "../utils/APIRoutes";

export default function CurrentUserDetails({ currentChat, onClose }) {
    console.log("Current Chat:", currentChat);

    return (
        <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-30 py-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-xl font-semibold">User Info</h2>
                <button onClick={onClose} className="bg-transparent text-gray-500 hover:text-black text-xl border-none outline-none focus:outline-none">
                    <MdOutlineKeyboardArrowRight size={22} />
                </button>
            </div>
            <div className="mt-auto flex flex-col items-center mt-4 border-b p-4">
                <img src={currentChat.avatarImage ? `${host}${currentChat.avatarImage}` : dummyUser} alt="User Avatar" className="w-16 h-16 rounded-full cursor-pointer object-cover" />
                <span className="text-green-500 text-xs mt-2">Online</span>
            </div>
            <div className="flex flex-col items-center px-2">

                <div className="flex flex-col bg-white gap-4 p-4 mt-4 rounded-md shadow-md">
                    <div>
                        <label className="text-gray-500 text-sm">Username</label>
                        <p>{currentChat.username}</p>
                    </div>
                    <div>
                        <label className="text-gray-500 text-sm">Email</label>
                        <p>{currentChat.email}</p>
                    </div>
                    <div>
                        <label className="text-gray-500 text-sm">Bio:</label>
                        <p className="text-xs">The star always shines, but can only be seen at night.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
