import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/Root';
import VendorSignup from './routes/vendorSignup/VendorSignup';
import VendorSignin from './routes/vendorSignin/VendorSignin';
import DashboardPage from './routes/DashboardPage';
import DashboardProducts from './components/dashboard/dashboardProducts/DashboardProducts';
import DashboardSettings from './components/dashboard/dashboardSettings/dashboardSettings';

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
      path: '/',
      element: <Root />,
      children: [
        {
          path: 'vendor/dashboard',
          element: <DashboardPage />,
          children: [
            {
              path: 'products',
              element: <DashboardProducts />,
            },
            {
              path: "settings",
              element: <DashboardSettings />
            }

          ],
        },
      ],
    },

  ],
  {}
);

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
