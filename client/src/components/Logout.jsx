import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";

export default function Logout() {
  const navigate = useNavigate();
  
  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <button
      onClick={handleClick}
      className="flex justify-center items-center p-2 rounded-md bg-purple-500 hover:bg-purple-600 transition duration-300 border-none"
    >
      <BiPowerOff className="text-lg text-white" />
    </button>
  );
}
