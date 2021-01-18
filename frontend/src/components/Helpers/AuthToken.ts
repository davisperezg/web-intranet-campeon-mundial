export function getToken() {
  return localStorage.getItem("token");
}

export function deleteToken(token: string) {
  return localStorage.removeItem(token);
}

export function setToken(token: string) {
  return localStorage.setItem("token", token);
}

export function refreshToken() {
  //deleteToken(token);
  return;
}
