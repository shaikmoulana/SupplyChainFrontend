import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import  {Products}  from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Forecast } from './pages/Forecast';
import { Recommendations } from './pages/Recommendations';
import { CreatePurchaseOrder } from './pages/CreatePurchaseOrder';
import { PurchaseOrders } from './pages/PurchaseOrders';
import { Suppliers } from './pages/Suppliers';
import { AddEditSupplier } from './pages/AddEditSupplier';
import { SupplierProcessing } from './pages/SupplierProcessing';
import { GoodsInward } from './pages/GoodsInward';
import { OrderFulfillment } from './pages/OrderFulfillment';
import { Shipping } from './pages/Shipping';
import { Delivery } from './pages/Delivery';
import { Login } from './pages/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/purchase-order" element={<CreatePurchaseOrder />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/suppliers/add" element={<AddEditSupplier />} />
            <Route path="/suppliers/edit/:id" element={<AddEditSupplier />} />
            <Route path="/suppliers/view/:id" element={<AddEditSupplier />} />
            <Route path="/supplier-processing" element={<SupplierProcessing />} />
            <Route path="/goods-inward" element={<GoodsInward />} />
            <Route path="/order-fulfillment" element={<OrderFulfillment />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
}
