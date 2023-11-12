import { Link } from 'react-router-dom';
import Container from './utils/Container';
import WebsiteIcon from './utils/WebsiteIcon';

const navItems = [
  {
    path: '/',
    text: 'home',
  },
  {
    path: '/dashboard',
    text: 'dashboard',
  },
];

const Header = () => {
  return (
    <div>
      <Container>
        <div className='py-8 flex justify-between items-center'>
          <WebsiteIcon />
          {/* navigation items */}
          <div className=''>
            <ul className='text-lg capitalize flex items-center justify-between md:gap-x-10  gap-y-4 [& a]:text-red-400 flex-wrap'>
              {navItems.map((navItem, index) => (
                <li key={index} className='flex-none'>
                  <Link to={navItem.path.trim()}>{navItem.text.trim()}</Link>
                </li>
              ))}
              <li>user</li>
            </ul>
          </div>
        </div>
        <hr />
      </Container>
    </div>
  );
};

export default Header;
