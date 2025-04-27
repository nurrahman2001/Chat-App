import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import blank_image from "../assets/blank_image.jpg";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const [openSection, setOpenSection] = useState(null);
    const { user } = useUser();
    const navigate = useNavigate();

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const baseUrl = "http://localhost:5000";
    const userAvatar = user?.avatarImage
        ? `${baseUrl}/${user.avatarImage.replace(/^\/+/, "")}`
        : blank_image;

    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>

            {/* Profile Image */}
            <div className="relative">
                <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <div
                    onClick={() => navigate("/setAvatar")}
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer"
                >
                    <FaEdit className="text-gray-600" />
                </div>
            </div>

            <h3 className="text-xl font-semibold mt-4">{user?.username || "User"}</h3>
            <select className="no-arrow px-3 py-1 bg-gray-100 text-xs w-22 text-gray-700 focus:outline-none cursor-pointer">
                <option>Available</option>
                <option>Busy</option>
                <option>Offline</option>
            </select>

            {/* Accordion Container — Scrollable */}
            <div
                className="w-full max-w-md mt-6 space-y-3 overflow-y-auto custom-scrollbar"
                style={{ maxHeight: "60vh" }} // Adjust height as needed
            >
                {["Personal Info", "Privacy", "Security", "Help"].map((section, index) => (
                    <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection(section)}
                        >
                            <h4 className="font-semibold">{section}</h4>
                            {openSection === section ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </div>

                        {openSection === section && section === "Personal Info" && (
                            <div className="flex flex-col bg-white gap-4 p-4 mt-4 rounded-md shadow-md">
                                <div>
                                    <label className="text-gray-500 text-sm">Username</label>
                                    <p>{user?.username}</p>
                                </div>
                                <div>
                                    <label className="text-gray-500 text-sm">Email</label>
                                    <p>{user?.email}</p>
                                </div>
                                <div>
                                    <label className="text-gray-500 text-sm">Bio:</label>
                                    <p className="text-xs">The star always shines, but can only be seen at night.</p>
                                </div>
                            </div>
                        )}

                        {openSection === section && section === "Privacy" && (
                            <div className="flex flex-col gap-4 bg-white p-4 mt-4 rounded-md shadow-md">
                                {["Profile Photo", "Status", "Last Seen"].map((label) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between w-full gap-4 border-b pb-2"
                                    >
                                        <p className="whitespace-nowrap text-gray-700 text-sm">{label}</p>
                                        <select className="no-arrow px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700 focus:outline-none w-18">
                                            <option>Everyone</option>
                                            <option>Contacts</option>
                                            <option>Nobody</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}

                        {openSection === section && section === "Security" && (
                            <div className="flex flex-col gap-4 bg-white p-4 mt-4 rounded-md shadow-md">
                                <div className="flex items-center justify-between w-full gap-4">
                                    <p className="whitespace-nowrap text-gray-700 text-sm">Show Security Notification</p>
                                    <input
                                        type="checkbox"
                                        name="security-notification"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {openSection === section && section === "Help" && (
                            <div className="flex flex-col gap-4 bg-white p-4 mt-4 rounded-md shadow-md">
                                {["FAQs", "Contact Us", "Terms & Privacy policy"].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center justify-between w-full gap-4 border-b pb-2 last:border-b-0"
                                    >
                                        <p className="whitespace-nowrap text-gray-700 text-sm font-semibold cursor-pointer">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
