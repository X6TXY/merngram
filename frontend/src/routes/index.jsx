import { Route, Routes } from "react-router-dom";

import { Auth } from "../components/auth";
import { About } from "../components/content/about";
import { Home } from "../components/content/home";
import { PostDetails } from "../components/content/post-details";
import { Profile } from "../components/profile";
import {Chat} from "../components/chat";

export const RouteList = () => {
  return (
    <Routes>
      <Route path="" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/post/:id" element={<PostDetails />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};
