import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Forecast } from './pages/Forecast';
import { Recommendations } from './pages/Recommendations';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </Layout>
    </Router>
  );
}
