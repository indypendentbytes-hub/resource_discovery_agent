import React from "react";
import ReactDOM from "react-dom/client";

/* Self-hosted fonts — bundled by Vite, served from the same origin as the app.
   Community visitors do not depend on Google Fonts or any third-party CDN. */
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";
import "@fontsource/biorhyme/700.css";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
