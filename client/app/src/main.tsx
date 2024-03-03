// import React from 'react'
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./assets/all.min.css";
import Authorization from "./components/Authorization/Authorization.tsx";
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Authorization>
    <App />
    <Toaster />
  </Authorization>
  // </React.StrictMode>,
);
