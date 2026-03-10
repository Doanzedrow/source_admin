import { Suspense, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRouter } from './routes';
import { ThemeProvider } from './config/theme';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Sync system theme or localstorage
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    // Listen to attribute changes optionally
    const observer = new MutationObserver(() => {
      const mode = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(mode === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider isDarkMode={isDarkMode}>
        <Suspense fallback={<div className="app-suspense-fallback">Loading...</div>}>
          <AppRouter />
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
