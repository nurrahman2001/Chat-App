import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { ChatPage } from "./pages/ChatPage";
import { SetAvatarPage } from "./pages/SetAvatarPage";
import { UserProvider } from "./context/UserContext";
import {CallPage} from "./pages/CallPage";

export const App = () => {
  return (
    <UserProvider> 
      <BrowserRouter>
        <Routes>
          <Route path="/call" element={<CallPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setAvatar" element={<SetAvatarPage />} />
          <Route path="/" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};
