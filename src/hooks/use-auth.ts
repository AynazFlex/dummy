import { api, ENDPOINTS } from "@/api";
import { create } from "zustand";
import { isAxiosError } from "axios";
import { removeTokens, saveTokens } from "@/services";

interface IAuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface ILoginProps {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface IUseAuthState {
  isAuthenticated: boolean;
  isLoginLoading: boolean;
  isAuthLoading: boolean;
  user: IAuthResponse | null;
  login: ({ username, password }: ILoginProps) => Promise<void>;
  logout: () => void;
  auth: () => Promise<void>;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const useAuth = create<IUseAuthState>((set) => ({
  isLoginLoading: false,
  isAuthLoading: false,
  isAuthenticated: false,
  user: null,
  login: async ({ username, password, rememberMe }) => {
    set({ isLoginLoading: true });
    try {
      const response = await api.post<ILoginResponse>(ENDPOINTS.LOGIN, {
        username,
        password,
        expiresInMins: 1,
      });
      saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
        rememberMe,
      );
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Неизвестная ошибка при входе. Пожалуйста, попробуйте снова.",
      );
      throw new Error(errorMessage);
    } finally {
      set({ isLoginLoading: false });
    }
  },
  logout: () => {
    removeTokens();
    set({ isAuthenticated: false, user: null });
  },
  auth: async () => {
    set({ isAuthLoading: true });
    try {
      const response = await api.get<IAuthResponse>(ENDPOINTS.AUTH_ME);
      set({ isAuthenticated: true, user: response.data });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Не удалось получить данные пользователя.",
      );
      throw new Error(errorMessage);
    } finally {
      set({ isAuthLoading: false });
    }
  },
}));
