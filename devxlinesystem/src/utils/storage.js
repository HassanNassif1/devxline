// src/utils/storage.js
const storage = {
  getToken: () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken'),
  setToken: (token, remember = false) => {
    const target = remember ? localStorage : sessionStorage;
    target.setItem('authToken', token);
  },
  removeToken: () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },
  getUser: () => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user, remember = false) => {
    const target = remember ? localStorage : sessionStorage;
    target.setItem('user', JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  },
  clear: () => {
    storage.removeToken();
    storage.removeUser();
  }
};

export default storage;