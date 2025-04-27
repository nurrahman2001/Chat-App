import React, { useState } from "react";
import axios from "axios";
import { addContactRoute } from "../utils/APIRoutes";

export default function AddNew () {
  const [mode, setMode] = useState("contact");

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
  });

  const [groupForm, setGroupForm] = useState({
    groupName: "",
    description: "",
    members: "",
    icon: null,
    iconPreview: null,
  });

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleGroupChange = (e) => {
    setGroupForm({ ...groupForm, [e.target.name]: e.target.value });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupForm({
        ...groupForm,
        icon: file,
        iconPreview: URL.createObjectURL(file),
      });
    }
  };

  const submitContact = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("chat-app-token");

      const res = await axios.post(
        addContactRoute,
        {
          email: contactForm.email,
          contactName: contactForm.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Contact added:", res.data);

      alert("Contact added successfully!");
      setContactForm({ name: "", email: "" });

    } catch (err) {
      console.error("Failed to add contact:", err);
      const msg =
        err.response?.data?.msg || "Something went wrong while adding contact!";
      alert(msg);
    }
  };

  const submitGroup = (e) => {
    e.preventDefault();
    console.log("Creating group:", groupForm);

    // TODO: implement group creation logic
  };

  return (
    <div className="flex flex-col bg-gray-100 items-center justify-start min-h-screen p-4">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Add New</h1>

      {/* Toggle Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMode("contact")}
          className={`p-2 rounded-md font-medium ${mode === "contact"
              ? "bg-blue-500 text-white outline-none focus:outline-none"
              : "bg-gray-200 text-gray-700"
            }`}
        >
          Add Contact
        </button>
        <button
          onClick={() => setMode("group")}
          className={`p-2 rounded-md font-medium ${mode === "group"
              ? "bg-blue-500 text-white outline-none focus:outline-none"
              : "bg-gray-200 text-gray-700"
            }`}
        >
          Create Group
        </button>
      </div>

      {/* Contact Form */}
      {mode === "contact" && (
        <form
          onSubmit={submitContact}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={contactForm.name}
              onChange={handleContactChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={contactForm.email}
              onChange={handleContactChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition outline-none focus:outline-none"
          >
            Add Contact
          </button>
        </form>
      )}

      {/* Group Form */}
      {mode === "group" && (
        <form
          onSubmit={submitGroup}
          className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-600">Group Name</label>
            <input
              type="text"
              name="groupName"
              value={groupForm.groupName}
              onChange={handleGroupChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Group Description</label>
            <textarea
              name="description"
              value={groupForm.description}
              onChange={handleGroupChange}
              className="w-full mt-1 px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Group Icon</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleIconChange}
              className="mt-1"
            />
            {groupForm.iconPreview && (
              <img
                src={groupForm.iconPreview}
                alt="Group Icon Preview"
                className="w-20 h-20 mt-2 rounded-full object-cover border"
              />
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600">
              Members (comma-separated usernames or emails)
            </label>
            <input
              type="text"
              name="members"
              value={groupForm.members}
              onChange={handleGroupChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition outline-none focus:outline-none"
          >
            Create Group
          </button>
        </form>
      )}
    </div>
  );
};
