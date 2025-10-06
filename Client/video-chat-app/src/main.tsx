import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import SocketProvider from "./context/SocketProvider.tsx";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <Provider store={store}>
<App />
        </Provider>
        
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>
);
