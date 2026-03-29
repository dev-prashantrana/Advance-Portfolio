import http from './http';

export const login = async (password) => {
  const res = await http.post('/auth/login', { password });
  return res.data;
};
