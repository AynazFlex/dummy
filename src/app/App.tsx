import type { FC } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Home, Login } from "@/pages";
import { ProtectedRoute } from "./providers";
import { AuthProvider } from "./providers";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
