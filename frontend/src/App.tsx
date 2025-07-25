import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthContext";
import Authorized from "@/components/Authorized";
import LoginPage from "@/pages/LoginPage";
import LogoutPage from "@/pages/LogoutPage";
import RoundsPage from "@/pages/RoundsPage";
import RoundPage from "@/pages/RoundPage";

const queryClient = new QueryClient();
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

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
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route
              path="/rounds"
              element={
                <Authorized>
                  <RoundsPage />
                </Authorized>
              }
            />
            <Route
              path="/rounds/:id"
              element={
                <Authorized>
                  <RoundPage />
                </Authorized>
              }
            />
            <Route path="/" element={<Navigate to="/rounds" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
