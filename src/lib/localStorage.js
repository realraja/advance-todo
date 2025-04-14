export const getOrSaveLocalStorage = ({ key, value, get = false }) => {
    if (typeof window === 'undefined') return null; // Avoid server-side crash
  
    if (get) {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };
  