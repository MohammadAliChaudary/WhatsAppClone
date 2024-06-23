import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { MessageProvider } from "./contexts/messagesProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <MessageProvider>
    <App />
  </MessageProvider>
  // {/* </React.StrictMode> */}
);
