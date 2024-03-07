import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import GamePage from "./components/GamePage/GamePage";
import LoginPage from "./components/LoginPage/LoginPage";
import ChatPage from "./components/ChatPage/ChatPage";
import SettingsPage from "./components/SettingsPage/SettingsPage";
import Friends from "./components/Friends/Friends";

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
          <Route path="/friends" element={<Friends />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
