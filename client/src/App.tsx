import './App.css';
import PaginatedProducts from './components/PaginatedProducts/PaginatedProducts';
import Container from './components/utils/Container';

function App() {
  return (
    <div className='min-h-screen py-10'>
      <Container>
        <h1 className='text-3xl font-semibold mb-16'>
          Welcome to Ecommerce store app <span className='animate-pulse'>🖐️</span>
        </h1>
        {/* --------------- dashboard ---------------- */}
        <div>
          <h1 className='text-xl font-semibold mb-10'>Dashboard</h1>
          <PaginatedProducts />
        </div>
      </Container>
    </div>
  );
}

export default App;
