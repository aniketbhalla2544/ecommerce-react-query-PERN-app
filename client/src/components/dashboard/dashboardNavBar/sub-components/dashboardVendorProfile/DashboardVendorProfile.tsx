import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import useOnClickOutside from 'use-onclickoutside';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiSignOutBold } from 'react-icons/pi';
import useAppStore from '../../../../../stores/zustand/appStore';
import ConditionalRender from '../../../../utils/ConditionalRender';
import appRoutes from '../../../../../utils/app.routes';
import { signoutVendor } from '../../../../../api/auth';
import toast from 'react-hot-toast';
import { resetAppState } from '../../../../../utils/auth.utils';

const VENDOR_PROFILE_IMG_URL =
  'https://res.cloudinary.com/dlgcmw9tb/image/upload/v1700667250/eqcozozbuqruzzjdsls8.jpg';

const DashboardVendorProfile = () => {
  const [showActionPopover, setShowActionPopover] = React.useState(false);
  const { vendorEmail } = useAppStore((state) => ({
    vendorName: state.vendor.fullname.trim(),
    vendorEmail: state.vendor.email,
  }));

  const elementRef = React.useRef<HTMLDivElement | null>(null);
  useOnClickOutside(elementRef, () => setShowActionPopover(false));

  const handleProfileBtnClick = () => setShowActionPopover(!showActionPopover);

  const handleLogoutBtnClick = async () => {
    try {
      await signoutVendor();
    } catch (error) {
      toast.error('error while signing out');
    } finally {
      resetAppState();
    }
  };

  return (
    <div ref={elementRef} className='h-20 flex-none relative'>
      <button
        type='button'
        onClick={handleProfileBtnClick}
        className='flex gap-x-2 items-center hover:bg-slate-100 focus:bg-slate-100 rounded-md p-3 w-full'
      >
        {/* ----------- vendor profile img */}
        <div className='w-7 h-7'>
          <img
            src={VENDOR_PROFILE_IMG_URL}
            alt='vendor-profile-img'
            className='w-full h-full object-cover rounded-full'
          />
        </div>
        {/* ----------- vendor profile email */}
        <p className='font-semibold text-sm'>{vendorEmail}</p>
      </button>
      {/* ---------------------- vendor profile Actions */}
      <ConditionalRender truthyCondition={showActionPopover}>
        <div className='cursor-auto z-20 bottom-[110%] left-0 right-0 absolute rounded-lg bg-white shadow ring-0 overflow-hidden whitespace-nowrap'>
          <ul className='capitalize flex flex-col gap-y-0 text-sm py-2 items-stretch'>
            <NavLink path={appRoutes.dashboard.DASHBOARD}>
              <span className='text-xs'>
                <FaExternalLinkAlt />
              </span>{' '}
              <span>Public website</span>
            </NavLink>
            <NavLink path={appRoutes.dashboard.DASHBOARD}>
              <IoSettingsOutline /> <span>Settings</span>
            </NavLink>
            <li>
              <button
                onClick={handleLogoutBtnClick}
                type='button'
                className='px-5 py-3 border-t-[1px] whitespace-nowrap text-center w-full min-w-[120px] hover:bg-red-100 flex items-center gap-x-2'
              >
                <PiSignOutBold /> <span>Sign out</span>
              </button>
            </li>
          </ul>
        </div>
      </ConditionalRender>
    </div>
  );
};

export default DashboardVendorProfile;

type NavLinkProps = {
  children: React.ReactNode;
  path: string;
};

const NavLink = ({ path, children }: NavLinkProps) => {
  const navigate = useNavigate();

  const handleBtnClick = () => navigate(path);

  return (
    <li>
      <button
        onClick={handleBtnClick}
        className='px-5 py-3 hover:bg-gray-100 whitespace-nowrap text-center min-w-[120px] flex items-center gap-x-2 w-full overflow-hidden'
      >
        {children}
      </button>
    </li>
  );
};
