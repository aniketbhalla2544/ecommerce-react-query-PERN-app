import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Container from '../components/utils/Container';
import '../index.css';

const Root = () => {
  return (
    <div className='overflow-hidden'>
      <Container>
        <Header />
        <h1>in root</h1>
        <Outlet />
      </Container>
    </div>
  );
};

export default Root;
