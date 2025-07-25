import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/queryClient";
import { AuthProvider } from "@/components/AuthContext";
import Protected from "@/components/Protected";
import LoginPage from "@/pages/LoginPage";
import LogoutPage from "@/pages/LogoutPage";
import RoundsPage from "@/pages/RoundsPage";
import RoundPage from "@/pages/RoundPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(0, 0, 0, 0.25)",
            color: "#ffffff",
            backdropFilter: "blur(20px)",
          },
        }}
      />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="*"
              element={
                <Protected>
                  <Routes>
                    <Route path="/logout" element={<LogoutPage />} />
                    <Route path="/rounds" element={<RoundsPage />} />
                    <Route path="/rounds/:id" element={<RoundPage />} />
                    <Route
                      path="*"
                      element={<Navigate to="/rounds" replace />}
                    />
                  </Routes>
                </Protected>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
