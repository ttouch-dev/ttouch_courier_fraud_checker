import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            },
            success: {
              iconTheme: { primary: "#10B981", secondary: "#1e293b" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#1e293b" },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
