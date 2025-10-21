import { useState, useMemo, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import dummyUser from "../assets/blank_image.jpg";
import { host } from "../utils/APIRoutes";

export default function Contacts({ changeChat }) {
  const { user, loading, fetchUser } = useUser(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSelected, setCurrentSelected] = useState(undefined);

  
  useEffect(() => {
    fetchUser();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredContacts = useMemo(() => {
    if (!user?.contacts) return [];
    return user.contacts
      .filter((contact) =>
        contact.contactName.toLowerCase().includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) =>
        a.contactName.toLowerCase().localeCompare(b.contactName.toLowerCase())
      );
  }, [searchTerm, user]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

if (loading) {
  return (
    <div className="p-4 bg-gray-100 h-screen flex flex-col">
      <h2 className="text-xl font-bold mb-4">Contacts</h2>

      {/* Search skeleton */}
      <div className="relative mb-4 bg-gray-200 rounded-md border">
        <div className="w-full h-10 rounded-md bg-gray-300 animate-pulse"></div>
      </div>

      {/* Skeleton contact list */}
      <div
        className="flex-1 overflow-y-auto space-y-4 pr-2"
        style={{ maxHeight: "calc(100vh - 150px)" }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center p-2 bg-gray-100 rounded-md animate-pulse"
          >
            {/* Avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>

            {/* Text skeleton */}
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                <div className="w-12 h-3 bg-gray-300 rounded"></div>
              </div>
              <div className="w-40 h-3 mt-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


  return (
    <div className="p-4 bg-gray-100 h-screen flex flex-col">
      <h2 className="text-xl font-bold mb-4">Contacts</h2>

      {/* Search Box */}
      <div className="relative mb-4 bg-gray-200 rounded-md border">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full p-2 pl-10 rounded-md bg-gray-200 focus:outline-none"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FaSearch className="absolute left-3 top-3 text-gray-500" />
      </div>

      {/* Contact List */}
      <div
        className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar"
        style={{ maxHeight: "calc(100vh - 150px)" }}
      >
        {filteredContacts.length === 0 ? (
          <p className="text-sm text-center text-gray-500">No contacts found.</p>
        ) : (
          filteredContacts.map((contact, index) => (
            <div
              key={index}
              className={`flex items-center p-2 cursor-pointer hover:bg-gray-200 transition duration-300 ${
                index === currentSelected ? "bg-gray-300" : "bg-gray-100"
              }`}
              onClick={() => changeCurrentChat(index, contact)}
            >
              <img
                src={contact.avatarImage ? `${host}${contact.avatarImage}` : dummyUser}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h4 className="font-semibold">{contact.contactName}</h4>
                </div>
                <p className="text-sm text-gray-600">Hey! there I'm available</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
