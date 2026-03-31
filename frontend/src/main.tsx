import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './components/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.APP_NAME}>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
