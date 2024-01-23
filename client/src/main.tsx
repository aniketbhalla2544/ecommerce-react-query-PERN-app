import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { router } from '@config/routes.config';
import { queryClient } from '@config/reactQueryClient';

ReactDOM.createRoot(
  document.getElementById('root') || document.createElement('div')
).render(
  <>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  </>
);
