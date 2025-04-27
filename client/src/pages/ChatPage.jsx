import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { allUsersRoute, host } from "../utils/APIRoutes";
import axios from "axios";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";
import Settings from "../components/Settings";
import Groups from "../components/Groups";
import ChatList from "../components/ChatList";
import AddNew from "../components/AddNew";
import ReceiveCall from "../components/RecieveCall";

export const ChatPage = () => {
  const socket = useRef(null);
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("chats");
  const isOnline = onlineUsers.includes(currentChat?.userId);

  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("chat-app-token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const { data } = await axios.get(`${host}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("chat-app-token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser?.isAvatarImageSet) {
        try {
          const token = localStorage.getItem("chat-app-token");
          const { data } = await axios.get(`${allUsersRoute}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setContacts(data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
      }
    };

    if (currentUser) fetchContacts();
  }, [currentUser, navigate]);

  // Initialize WebSocket
  useEffect(() => {
    if (currentUser && !socket.current) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser.userId);

      return () => {
        if (socket.current) {
          socket.current.disconnect();
          socket.current = null;
        }
      };
    }
  }, [currentUser]);

  // Track online users
  useEffect(() => {
    if (socket.current) {
      socket.current.on("online-users", (onlineUserIds) => {
        setOnlineUsers(onlineUserIds);
      });
    }
  }, [socket.current]);


  // Incoming call listener
  useEffect(() => {
    if (!socket.current || !currentUser) return;

    const handleIncomingCall = (data) => {
      console.log("Incoming call received:", data);
      setIncomingCall(data);
    };

    socket.current.on("incoming-call", handleIncomingCall);

    return () => {
      if (socket.current) {
        console.log("Removing incoming call listener");
        socket.current.off("incoming-call", handleIncomingCall);
      }
    };
  }, [currentUser]);

  // Update acceptCall function
  const acceptCall = async () => {
    if (!incomingCall) return;

    // Find the contact info for the caller
    const callerContact = contacts.find(c => c.userId === incomingCall.from) || {
      userId: incomingCall.from,
      username: incomingCall.name,
      avatarImage: incomingCall.avatar,
    };

    navigate("/call", {
      state: {
        currentChat: {
          userId: incomingCall.from,
          contactId: incomingCall.from,
          contactName: incomingCall.name,
          avatarImage: incomingCall.avatar,
        },
        callType: incomingCall.callType,
        offer: incomingCall.offer,
        isIncoming: true  
      },
    });

    setIncomingCall(null);
  };

  // Update rejectCall function
  const rejectCall = () => {
    if (!incomingCall || !socket.current) return;

    socket.current.emit("reject-call", {
      to: incomingCall.from,
    });

    setIncomingCall(null);
  };
  // Component switcher
  const renderComponent = () => {
    switch (selectedComponent) {
      case "chats":
        return (
          <ChatList
            contacts={contacts}
            currentUser={currentUser}
            changeChat={setCurrentChat}
          />
        );
      case "settings":
        return <Settings currentUser={currentUser} />;
      case "groups":
        return <Groups />;
      case "add":
        return <AddNew />;
      default:
        return (
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={setCurrentChat}
          />
        );
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Sidebar
        currentUser={currentUser}
        setSelectedComponent={setSelectedComponent}
      />
      <div className="flex-1 flex flex-col bg-gray-300">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[25%_75%]">
          {renderComponent()}
          {isLoaded && !currentChat ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              isOnline={isOnline}
              socket={socket}
            />
          )}
          {incomingCall && (
            <ReceiveCall
              incomingCall={incomingCall}
              acceptCall={acceptCall}
              rejectCall={rejectCall}
            />
          )
          }

        </div>
      </div>
    </div>
  );
};
