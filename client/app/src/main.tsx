// import React from 'react'
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./assets/all.min.css";
import Authorization from "./components/Authorization/Authorization.tsx";
import { ToastContainer, toast } from 'react-toastify';

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Authorization>
  <App />
  <ToastContainer />
  </Authorization>
  // </React.StrictMode>,
);
