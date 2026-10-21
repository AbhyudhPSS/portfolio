import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// First-party, cookieless, served from our own origin — passes `script-src 'self'`.
if (import.meta.env.PROD) {
  const analytics = document.createElement('script')
  analytics.defer = true
  analytics.src = '/_vercel/insights/script.js'
  document.head.appendChild(analytics)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
