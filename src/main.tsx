import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './i18n'; // Khởi tạo i18n trước
import './styles/global.less'; // Load global styles + variables override

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
