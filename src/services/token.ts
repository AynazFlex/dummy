const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

const getTokenStorage = (): Storage => {
  if (
    localStorage.getItem(ACCESS_TOKEN) ||
    localStorage.getItem(REFRESH_TOKEN)
  ) {
    return localStorage;
  }

  return sessionStorage;
};
export const saveTokens = (
  accessToken: string,
  refreshToken: string,
  remember: boolean,
) => {
  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(ACCESS_TOKEN, accessToken);
  storage.setItem(REFRESH_TOKEN, refreshToken);
};

export const setAccessToken = (token: string) => {
  const storage = getTokenStorage();
  storage.setItem(ACCESS_TOKEN, token);
};
export const setRefreshToken = (token: string) => {
  const storage = getTokenStorage();
  storage.setItem(REFRESH_TOKEN, token);
};

export const hasAccessToken = () =>
  !!(
    localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN)
  );

export const getAccessToken = () =>
  localStorage.getItem(ACCESS_TOKEN) ||
  sessionStorage.getItem(ACCESS_TOKEN) ||
  "";
export const getRefreshToken = () =>
  localStorage.getItem(REFRESH_TOKEN) ||
  sessionStorage.getItem(REFRESH_TOKEN) ||
  "";

export const removeTokens = () => {
  localStorage.removeItem(REFRESH_TOKEN);
  sessionStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(ACCESS_TOKEN);
  sessionStorage.removeItem(ACCESS_TOKEN);
};
