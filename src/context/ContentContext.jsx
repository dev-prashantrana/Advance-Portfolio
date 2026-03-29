import { createContext, useContext, useEffect, useState } from 'react';
import http from '../api/http';
import { fetchContent, saveContent } from '../api/content';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchContent();
      setContent(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const trackVisit = async () => {
    if (window.location.pathname.startsWith('/admin')) return;
    try {
      await http.post('/content/visit');
    } catch {
      // ignore failures
    }
  };

  const update = async (updates) => {
    setLoading(true);
    try {
      const updated = await saveContent(updates);
      setContent(updated);
      setError(null);
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    trackVisit();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error, reload: load, update }}>
      {children}
    </ContentContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
};
