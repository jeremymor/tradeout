'use client';

import { useState, useEffect } from 'react';

const VISITED_KEY = 'tradeout_visited';

export function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem(VISITED_KEY);
    setIsFirstVisit(!hasVisited);
    setIsLoading(false);
  }, []);

  const markVisited = () => {
    localStorage.setItem(VISITED_KEY, 'true');
    setIsFirstVisit(false);
  };

  return {
    isFirstVisit,
    isLoading,
    markVisited,
  };
}
