import { RouteObject, createMemoryRouter } from 'react-router-dom';
import DashboardProducts from '@components/dashboard/dashboardProducts/DashboardProducts';
import DashboardVendorSettings from '@components/dashboard/dashboardSettings/dashboardSettings';
import VendorSignup from '@react-router-dom/routes/vendorSignup/VendorSignup';
import VendorSignin from '@react-router-dom/routes/vendorSignin/VendorSignin';
import Root from '@react-router-dom/routes/Root';
import DashboardPage from '@react-router-dom/routes/DashboardPage';
import appRoutes from '@constants/app.routes';

/**
 * A <MemoryRouter> stores its locations internally in an array which
 * makes it ideal for testing purposes.
 */

const vendorAppRoutes: RouteObject[] = [
  {
    path: '/register',
    Component: VendorSignup,
  },
  {
    path: '/sign-in',
    Component: VendorSignin,
  },
  {
    path: '/',
    Component: Root,
    children: [
      {
        path: 'vendor/dashboard',
        Component: DashboardPage,
        children: [
          {
            path: 'products',
            Component: DashboardProducts,
          },
          {
            path: 'settings',
            Component: DashboardVendorSettings,
          },
        ],
      },
    ],
  },
];

export const router = createMemoryRouter(vendorAppRoutes, {
  initialEntries: [appRoutes.SIGNIN],
});
