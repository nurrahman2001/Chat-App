import React from "react";
import { FaTimes, FaPhone } from "react-icons/fa";
import dummyUser from "../assets/blank_image.jpg";
import { host } from "../utils/APIRoutes";

const ReceiveCall = ({ incomingCall, acceptCall, rejectCall }) => {
  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[85vw] max-w-sm p-6 rounded-2xl shadow-2xl flex flex-col items-center relative">
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="animate-ping absolute inline-flex h-28 w-28 rounded-full bg-green-400 opacity-75"></div>
          <img
            src={
              incomingCall.avatar
                ? `${host}${incomingCall.avatar}`
                : dummyUser
            }
            alt="Caller Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-green-500"
          />
        </div>

        {/* Caller Name */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{incomingCall.name}</h2>

        {/* Call Type */}
        <p className="text-gray-500 text-sm mb-6">
          {incomingCall.callType === "audio" ? "Incoming Audio Call" : "Incoming Video Call"}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-8">
          <button
            onClick={acceptCall}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition"
          >
            <FaPhone className="text-white" size={22} />
          </button>

          <button
            onClick={rejectCall}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition"
          >
            <FaTimes className="text-white" size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveCall;
