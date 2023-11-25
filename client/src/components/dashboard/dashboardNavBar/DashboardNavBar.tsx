import { SlGraph } from 'react-icons/sl';
import { IoBagOutline } from 'react-icons/io5';
import { BsPeople } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoChecklist } from 'react-icons/go';

const navLinks = [
  {
    path: '/vendor/dashboard',
    Icon: <SlGraph />,
    name: 'statistics' as const,
  },
  {
    path: '/vendor/dashboard/products',
    Icon: <IoBagOutline />,
    name: 'products' as const,
  },
  {
    path: '/vendor/dashboard',
    Icon: <GoChecklist />,
    name: 'orders' as const,
  },
  {
    path: '/vendor/dashboard',
    Icon: <BsPeople />,
    name: 'customers' as const,
  },
];

const DashboardNavBar = () => {
  return (
    <div className='flex flex-col gap-y-10 py-10'>
      <ul className='flex flex-col gap-y-2'>
        {navLinks.map((navLink, index) => (
          <NavLink
            key={index}
            path={navLink.path}
            Icon={navLink.Icon}
            name={navLink.name}
          />
        ))}
        <hr />
      </ul>
    </div>
  );
};

export default DashboardNavBar;

type NavLinkProps = { Icon: JSX.Element; name: string; path: string };
type CurrentPathName = (typeof navLinks)[number]['name'];

function NavLink({ Icon, name, path }: NavLinkProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeNavLinkName = location?.state?.currentPathName as
    | CurrentPathName
    | undefined;
  const isActive = activeNavLinkName === name;
  const activeLinkStyling = isActive ? ' text-black bg-blue-50' : 'text-gray-500';

  const handleNavBtnClick = () => {
    navigate(path, {
      preventScrollReset: true,
      state: {
        currentPathName: name,
      },
    });
  };

  return (
    <li>
      <button
        onClick={handleNavBtnClick}
        type='button'
        className={`${activeLinkStyling}  font-semibold flex gap-x-4 items-center hover:text-black hover:bg-blue-50 py-3 px-4 rounded-lg w-full`}
      >
        <p className='font-bold text-xl'>{Icon}</p>
        <p className='uppercase text-sm'>{name}</p>
      </button>
    </li>
  );
}
