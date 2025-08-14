import { useState, useEffect } from 'react'

export function useNetworkError() {
  const [hasNetworkError, setHasNetworkError] = useState(() => {
    const stored = localStorage.getItem('networkError');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('networkError', JSON.stringify(hasNetworkError));
  }, [hasNetworkError]);

  setTimeout(() => {
    if (hasNetworkError) {
      fetch('https://www.google.com')
        .then(() => {
          setHasNetworkError(false);
        })
        .catch(() => {
          setHasNetworkError(true);
        });
    }
  }, 3000);

  const networkError = (isError: { isError?: boolean }) => {
    if (isError && isError.isError) {
      setHasNetworkError(true);
      return true;
    }
    setHasNetworkError(false);
    return false;
  };

  return { hasNetworkError, networkError };
}