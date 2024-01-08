import { Link } from 'react-router-dom';
import Container from '../utils/Container';
import WebsiteIcon from '../utils/WebsiteIcon';
import appRoutes from '../../constants/app.routes';
import useAuth from '../../hooks/useAuth';
import ConditionalRender from '../utils/ConditionalRender';
import VendorProfile from './sub-components/VendorProfile';

const navItems = [
  {
    path: appRoutes.REGISTER,
    text: 'register',
  },
  {
    path: appRoutes.SIGNIN,
    text: 'sign in',
  },
  {
    path: appRoutes.HOME,
    text: 'home',
    protected: true,
  },
  {
    path: appRoutes.dashboard.DASHBOARD,
    text: 'dashboard',
    protected: true,
  },
];

const Header = () => {
  const { isVendorLoggedIn } = useAuth();
  return (
    <Container>
      <div className='py-6 flex justify-between items-center border-1 border-red-600'>
        <WebsiteIcon />
        {/* navigation items */}
        <div className=''>
          <ul className='text-base capitalize flex items-center justify-between md:gap-x-10  gap-y-4 [& a]:text-red-400 flex-wrap'>
            {navItems.map((navItem, index) => {
              return (
                isVendorLoggedIn &&
                navItem.protected && (
                  <li key={index} className='flex-none'>
                    <Link to={navItem.path.trim()}>{navItem.text.trim()}</Link>
                  </li>
                )
              );
            })}
            <ConditionalRender truthyCondition={isVendorLoggedIn}>
              <VendorProfile />
            </ConditionalRender>
          </ul>
        </div>
      </div>
      <hr />
    </Container>
  );
};

export default Header;
