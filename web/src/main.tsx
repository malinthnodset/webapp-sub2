// Application entry point — the first file that runs.
// It loads the global CSS and wraps <App /> in three "providers" that every page needs.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './context/AuthProvider';

// Order matters: Bootstrap first, then our own CSS so our rules win (same as _Layout.cshtml in Subapp 1)
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/variables.css';
import './styles/panel.css';
import './styles/global.css';

import App from './App';

const queryClient = new QueryClient(); // creates the single instance (Demo 6)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 1. TanStack Query: every page can use useQuery / useMutation */}
    <QueryClientProvider client={queryClient}>
      {/* 2. React Router: the URL decides which page is shown.
             useTransitions={false}: React Router v8 changes pages as a low-priority "transition".
             Then logout would remove the user BEFORE we leave the page, and ProtectedRoute would
             jump to /login instead of the welcome page. Off = page change and logout happen together. */}
      <BrowserRouter useTransitions={false}>
        {/* 3. AuthProvider: every page can use useAuth() to know who is logged in (Demo 10) */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);