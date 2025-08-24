import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

window.BUILD_INFO = {
  branch: import.meta.env.VITE_BRANCH_NAME,
  buildTime: import.meta.env.VITE_BUILD_TIME,
  commitHash: import.meta.env.VITE_COMMIT_HASH,
  commitDate: import.meta.env.VITE_COMMIT_DATE,
};
