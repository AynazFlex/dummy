import { Load } from "@/components";
import { useAuth } from "@/hooks";
import { hasAccessToken } from "@/services";
import { notifications } from "@mantine/notifications";
import { useEffect, type ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth((state) => state.auth);
  const isAuthLoading = useAuth((state) => state.isAuthLoading);

  useEffect(() => {
    const accessToken = hasAccessToken();
    if (!accessToken) return;

    const fetchUserData = async () => {
      try {
        await auth();
      } catch (err) {
        notifications.show({
          title: "Ошибка аутентификации",
          message: (err as Error).message,
          color: "red",
          withCloseButton: true,
          position: "top-right",
          autoClose: 5000,
        });
      }
    };

    fetchUserData();
  }, []);

  if (isAuthLoading) {
    return <Load />;
  }

  return <>{children}</>;
};
