import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import appRoutes from '../../../constants/app.routes';
import ConditionalRender from '../../utils/ConditionalRender';
import useOnClickOutside from 'use-onclickoutside';
import useAppStore from '../../../stores/zustand/zustand.store';
import { signoutVendor } from '../../../api/auth';
import { resetAppState } from '../../../utils/auth.utils';

const VENDOR_PROFILE_IMG_URL =
  'https://res.cloudinary.com/dlgcmw9tb/image/upload/v1700667250/eqcozozbuqruzzjdsls8.jpg';

const VendorProfile = () => {
  const { vendorName, vendorEmail } = useAppStore((state) => ({
    vendorName: state.vendor.fullname.trim(),
    vendorEmail: state.vendor.email,
  }));
  const [showActionPopover, setShowActionPopover] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement | null>(null);
  useOnClickOutside(elementRef, () => setShowActionPopover(false));

  const handleImgClick = () => setShowActionPopover(!showActionPopover);

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
    <div
      ref={elementRef}
      className='z-8 relative w-8 h-8 ring-4 rounded-full cursor-pointer'
    >
      <VendorProfileImg onImgClick={handleImgClick} />
      <ConditionalRender truthyCondition={showActionPopover}>
        <div className='cursor-auto z-20 right-0 top-[125%] absolute rounded-lg bg-white shadow-lg ring-0 overflow-hidden whitespace-nowrap'>
          <div className='py-4 bg-blue-100 flex gap-x-4 hover:bg-blue-200 px-8'>
            <div className=' self-center'>
              <div className='w-8 h-8'>
                <VendorProfileImg />
              </div>
            </div>
            <div>
              <p className='font-semibold whitespace-nowrap text-sm mb-1'>{vendorName}</p>
              <p className='text-xs normal-case text-blue-500'>{vendorEmail}</p>
            </div>
          </div>
          <ul className='capitalize flex flex-col gap-y-2 text-sm py-4 items-stretch'>
            <NavLink path={appRoutes.dashboard.DASHBOARD}>update profile</NavLink>
            <NavLink path={appRoutes.dashboard.DASHBOARD}>my products</NavLink>
            <hr />
            <li>
              <button
                onClick={handleLogoutBtnClick}
                type='button'
                className='px-3 py-2 whitespace-nowrap text-center w-full min-w-[120px] hover:bg-red-100'
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </ConditionalRender>
    </div>
  );
};

export default VendorProfile;

type NavLinkProps = {
  children: React.ReactNode;
  path: string;
};

const NavLink = ({ path, children }: NavLinkProps) => {
  const navigate = useNavigate();

  const handleBtnClick = () => navigate(path);

  return (
    <li className='flex'>
      <button
        onClick={handleBtnClick}
        className='block capitalize px-8 py-3 hover:bg-gray-100 whitespace-nowrap text-center min-w-[120px] flex-auto'
      >
        {children}
      </button>
    </li>
  );
};

type VendorProfileImg = {
  onImgClick?: () => void;
};

const VendorProfileImg = ({ onImgClick }: VendorProfileImg) => {
  return (
    <img
      onClick={onImgClick}
      src={VENDOR_PROFILE_IMG_URL}
      alt='vendor-profile-img'
      className='w-full h-full object-cover rounded-full'
    />
  );
};
