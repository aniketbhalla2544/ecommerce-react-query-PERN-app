import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Container from '../components/utils/Container';
import '../index.css';

const Root = () => {
  return (
    <div className='overflow-hidden'>
      <Container>
        <Header />
        <Outlet />
      </Container>
    </div>
  );
};

export default Root;
