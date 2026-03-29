import http from './http';

export const fetchContent = async () => {
  const res = await http.get('/content');
  return res.data;
};

export const saveContent = async (content) => {
  const res = await http.put('/content', content);
  return res.data;
};
