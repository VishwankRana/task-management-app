import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ProjectProvider } from "./context/ProjectContext.jsx";  
import "./index.css";
import App from "./app.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </BrowserRouter>
  </StrictMode>
);