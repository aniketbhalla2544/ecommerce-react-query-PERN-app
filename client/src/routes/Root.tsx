import { Navigate, Outlet } from 'react-router-dom';
import '../index.css';
import useAuth from '../hooks/useAuth';
import appRoutes from '../constants/app.routes';
import ConditionalRender from '../components/utils/ConditionalRender';
import DeleteModal from '../components/utils/modals/DeleteModal';
// PROTECTED ROUTES

const Root = () => {
  const { isVendorLoggedIn } = useAuth();

  return (
    <>
      <div className='overflow-hidden min-h-screen'>
        <ConditionalRender
          truthyCondition={isVendorLoggedIn}
          falseCaseElement={<Navigate to={appRoutes.SIGNIN} replace={true} />}
        >
          <Outlet />
        </ConditionalRender>
      </div>
      <DeleteModal />
    </>
  );
};

export default Root;
