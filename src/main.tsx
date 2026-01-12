import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App"; // Make sure App.tsx exists in src/app
import { Providers } from "./app/providers"; // Correct path
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
