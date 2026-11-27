// Application entry point — the first file that runs.
// It loads the global CSS and renders <App /> into <div id="root"> in index.html.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Order matters: Bootstrap first, then our own CSS so our rules win (same as _Layout.cshtml in Subapp 1)
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import './styles/panel.css';
import './styles/global.css';

import App from './App';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* BrowserRouter makes the URL (/courses, /login ...) decide which page is shown */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);