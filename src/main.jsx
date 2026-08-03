import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/biorhyme/700.css";

import App from "./App";
import PublicDashboard from "./pages/PublicDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import "./index.css";
import "./dashboard.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<PublicDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
    <SpeedInsights />
  </React.StrictMode>
);
