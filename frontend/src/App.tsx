import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Authorized from "@/components/Authorized";
import LoginPage from "@/components/LoginPage";
import LogoutPage from "@/components/LogoutPage";
import RoundsPage from "@/components/RoundsPage";
import RoundPage from "@/components/RoundPage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Toaster
        position="top-right"
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
