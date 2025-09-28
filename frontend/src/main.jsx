import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // ok if missing; create a blank file if needed
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root in index.html");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
