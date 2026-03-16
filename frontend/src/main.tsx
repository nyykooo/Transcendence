import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.APP_NAME}>
      <App />
    </BrowserRouter>
  </StrictMode>
)
