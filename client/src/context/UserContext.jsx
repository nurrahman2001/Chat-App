import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("chat-app-token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const { userId } = decoded;
      // Fetch main user data
      const userRes = await axios.get(`http://localhost:5000/api/auth/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = userRes.data;
      const contactEntries = userData.contacts || [];
      const contactDataPromises = contactEntries.map(async (entry) => {
        try {
          const res = await axios.get(`http://localhost:5000/api/auth/user/${entry.contactId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          return {
            userId: entry.contactId,
            contactName: entry.contactName,
            lastMessage: entry.lastMessage,
            lastMessageAt: entry.lastMessageAt,
            avatarImage: res.data.avatarImage,
            isAvatarImageSet: res.data.isAvatarImageSet,
            email: res.data.email,

          };
        } catch (err) {
          console.error("Failed to fetch contact:", entry.contactId, err);
          return null;
        }
      });

      const populatedContacts = (await Promise.all(contactDataPromises)).filter(Boolean);

      setUser({
        ...userData,
        contacts: populatedContacts,
      });

    } catch (err) {
      console.error("Failed to fetch user:", err);
      localStorage.removeItem("chat-app-token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("chat-app-token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
