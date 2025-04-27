import React from "react";
import logo from "../assets/logo.svg"

export default function Welcome({ currentUser }) {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-200">
      <img src={logo} className="w-14 h-14"></img>
      <h1 className=" text-2xl">
        Welcome,{currentUser.username} <span className="text-purple-600"></span>
      </h1>
      <div className="w-[70%] flex flex-col items-center justify-center">
        <p className="text-md ">Connect, chat, and share moments with your friends in real time.</p>
        <p className="text-md "> Start a conversation now and make every message count! </p>
      </div>

    </div>
  );
}
