import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import LogoutPage from "./components/LogoutPage";
import RoundsPage from "./components/RoundsPage";
import RoundPage from "./components/RoundPage";

function App() {
  return (
    <AuthProvider>
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
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/rounds" element={<RoundsPage />} />
          <Route path="/rounds/:id" element={<RoundPage />} />
          <Route path="/" element={<Navigate to="/rounds" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
