import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { BrowserRouter as Router } from "react-router-dom";
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = createRoot(rootElement);

const appId = "JOdXQiwzol7562D3iwVP7ewzlj8eUNO8B1UW95tz";
const serverUrl = "https://ydvvsrwclky5.usemoralis.com:2053/server";

root.render(
  <React.StrictMode>
    <MoralisProvider initializeOnMount appId={appId} serverUrl={serverUrl}>
      <NotificationProvider>
        <Router>
          <App />
        </Router>
      </NotificationProvider>
    </MoralisProvider>
  </React.StrictMode>
);
