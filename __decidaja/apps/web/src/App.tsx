import React, { useState, useEffect } from 'react';
import Portfolio from './components/Portfolio';
import DecidiJa from './components/DecidiJa';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (currentPath === '/decidaja') {
    return <DecidiJa onBack={() => navigateTo('/')} />;
  }

  return <Portfolio onNavigateToDecidiJa={() => navigateTo('/decidaja')} />;
}
