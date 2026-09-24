// Defensive barrier for read-only fetch getter in sandboxed preview environments
if (typeof window !== 'undefined') {
  const shouldSuppress = (msg?: string) => typeof msg === 'string' && msg.includes('fetch') && msg.includes('getter');
  window.addEventListener('error', (event) => {
    if (event && (shouldSuppress(event.message) || (event.error && shouldSuppress(event.error.message)))) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
      return true;
    }
  }, true);
  window.addEventListener('unhandledrejection', (event) => {
    if (event && event.reason && shouldSuppress(event.reason.message)) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
      return true;
    }
  }, true);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
);

