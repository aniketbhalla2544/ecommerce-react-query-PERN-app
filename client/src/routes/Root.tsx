import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import Container from '../components/utils/Container';
import '../index.css';
import useAuth from '../hooks/useAuth';
import appRoutes from '../utils/app.routes';
import ConditionalRender from '../components/utils/ConditionalRender';

// PROTECTED ROUTES

const Root = () => {
  const { isVendorLoggedIn } = useAuth();

  return (
    <div className='overflow-hidden'>
      <div className='shadow'>
        <Header />
      </div>
      <Container>
        <ConditionalRender
          truthyCondition={isVendorLoggedIn}
          falseCaseElement={<Navigate to={appRoutes.SIGNIN} replace={true} />}
        >
          <Outlet />
        </ConditionalRender>
      </Container>
    </div>
  );
};

export default Root;
