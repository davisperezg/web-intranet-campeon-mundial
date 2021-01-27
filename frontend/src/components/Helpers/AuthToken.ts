export function deleteToken() {
  return localStorage.removeItem("accessToken");
}

export function deleteRefreshToken() {
  return localStorage.removeItem("refreshToken");
}

export function setToken(token: string) {
  return localStorage.setItem("accessToken", token);
}

export function setRefreshToken(token: string) {
  return localStorage.setItem("refreshToken", token);
}

export function getToken() {
  return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}
