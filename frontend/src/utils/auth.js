const AUTH_USER_KEY = 'auth_user';

export function saveUser(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const value = localStorage.getItem(AUTH_USER_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getUser()?.username);
}

export function clearAuth() {
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem('token');
}
