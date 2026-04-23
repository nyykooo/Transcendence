import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import AuthProvider from './components/AuthProvider';

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.APP_NAME}>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
