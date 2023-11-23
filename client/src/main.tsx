import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/Root';
import Dashboard from './routes/Dashboard';
import VendorSignup from './routes/vendorSignup/VendorSignup';
import VendorSignin from './routes/vendorSignin/VendorSignin';

export const router = createBrowserRouter(
  [
    {
      path: '/register',
      element: <VendorSignup />,
    },
    {
      path: '/signin',
      element: <VendorSignin />,
    },

    {
      path: '/vendor',
      element: <Root />,
      children: [
        {
          path: '/vendor/dashboard',
          element: <Dashboard />,
        },
      ],
    },
  ],
  {}
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
