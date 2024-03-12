import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import GamePage from "./components/GamePage/GamePage";
import LoginPage from "./components/LoginPage/LoginPage";
import ChatPage from "./components/ChatPage/ChatPage";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import Twofa from "./components/Twofa/Twofa";
import NotFound from "./components/NotFound/NotFound";
import Profile from "./components/Profile/Profile";
import FriendsList from "./components/Friends/FriendsList";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Game" element={<GamePage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Chat" element={<ChatPage />} />
          <Route path="/Settings" element={<SettingsPage />} />
          <Route path="/Auth" element={<Twofa />} />
          <Route path="/friends" element={<FriendsList />} />
          <Route path="/Profile/:id" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
