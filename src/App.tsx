import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRouter } from './routes';
import { ThemeProvider } from './config/theme';
import { useAppTheme } from './hooks/useAppTheme';
import { AppLoader } from '@/components/common/AppLoader';

function App() {
  const { isDarkMode } = useAppTheme();

  return (
    <Provider store={store}>
      <ThemeProvider isDarkMode={isDarkMode}>
        <Suspense fallback={<AppLoader />}>
          <AppRouter />
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
