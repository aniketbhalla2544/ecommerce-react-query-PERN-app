import { Outlet } from 'react-router-dom';
import DashboardNavBar from '../components/dashboard/dashboardNavBar/DashboardNavBar';
import WebsiteIcon from '../components/utils/WebsiteIcon';
import DashboardVendorProfile from '../components/dashboard/dashboardNavBar/sub-components/dashboardVendorProfile/DashboardVendorProfile';

const DashboardPage = () => {
  return (
    <div className=' flex min-h-screen overflow-hidden'>
      <div className='flex-none w-[250px] pt-10 px-5 bg-white border-r-[1px] border-slate-200 flex flex-col'>
        <div className='flex-auto'>
          <div className='mb-2'>
            <WebsiteIcon textSize='text-xl' />
          </div>
          <DashboardNavBar />
        </div>
        <DashboardVendorProfile />
      </div>
      <div className='flex-auto bg-gray-50 px-4 max-h-screen overflow-y-auto'>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardPage;
