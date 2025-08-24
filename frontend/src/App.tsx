import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider as StoreProvider } from "jotai";
import { queryClient } from "@/core/queryClient";
import { store } from "@/core/jotaiStore";
import AuthGuard from "@/components/AuthGuard";
import { Toaster } from "@/components/Toaster";
import LogoutPage from "@/pages/LogoutPage";
import RoundsPage from "@/pages/RoundsPage";
import RoundPage from "@/pages/RoundPage";

function App() {
  return (
    <>
      <Toaster />

      <StoreProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthGuard>
            <BrowserRouter>
              <Routes>
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/rounds" element={<RoundsPage />} />
                <Route path="/rounds/:id" element={<RoundPage />} />
                <Route path="*" element={<Navigate to="/rounds" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthGuard>
        </QueryClientProvider>
      </StoreProvider>
    </>
  );
}

export default App;
