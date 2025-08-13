import { useState, useEffect } from 'react'

export function useNetworkError() {
  const [hasNetworkError, setHasNetworkError] = useState(() => {
    const stored = localStorage.getItem('networkError');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('networkError', JSON.stringify(hasNetworkError));
  }, [hasNetworkError]);

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