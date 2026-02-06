import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductUI {
  id: number;
  name: string;
  category: string;
  unitPrice: number;
  onHand: number;
  reorderLevel: number;
  leadTime: number;
  predicted7DayDemand: number;
}

export function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<ProductUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const [productsRes, inventoryRes] = await Promise.all([
        fetch('http://localhost:5281/api/Product'),
        fetch('http://localhost:5281/api/inventory/recommendations')
      ]);

      const productsData = await productsRes.json();
      const inventoryData = await inventoryRes.json();

      const uiProducts: ProductUI[] = await Promise.all(
        productsData.map(async (p: any) => {
          const inventory = inventoryData.find((i: any) => i.productId === p.productId);

          const forecastRes = await fetch(
            `http://localhost:5281/api/forecast/${p.productId}`
          );
          const forecastData = await forecastRes.json();

          const predicted7DayDemand = forecastData.reduce(
            (sum: number, f: any) => sum + f.predictedQty,
            0
          );

          return {
            id: p.productId,
            name: p.productName,
            category: p.category,
            unitPrice: p.unitPrice,
            onHand: inventory?.currentStock ?? 0,
            reorderLevel: inventory?.recommendedReorderQty ?? 0,
            leadTime: 7, // static for now (can come from backend later)
            predicted7DayDemand: Math.round(predicted7DayDemand)
          };
        })
      );

      setProducts(uiProducts);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading products...</p>;
  }

  return (
    <div className="space-y-6">
      {/* 🔹 EVERYTHING BELOW IS YOUR ORIGINAL UI — UNTOUCHED */}

      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Products</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View product details and 7-day predictions
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => {
          const stockPercentage = (product.onHand / product.reorderLevel) * 100;
          const willStockout = product.predicted7DayDemand > product.onHand;

          const stockStatus = willStockout
            ? { label: 'Risk of Stockout', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
            : stockPercentage <= 100
            ? { label: 'Below Reorder Level', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' }
            : { label: 'Good Stock', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };

          return (
            <div
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {product.category}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Unit Price</p>
                  <p className="text-lg font-semibold">${product.unitPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Stock</p>
                  <p className="text-lg font-semibold">{product.onHand} units</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reorder Level</p>
                  <p className="text-lg font-semibold">{product.reorderLevel} units</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lead Time</p>
                  <p className="text-lg font-semibold">{product.leadTime} days</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">7-Day Predicted Demand</p>
                <p className="text-2xl font-bold text-blue-600">
                  {product.predicted7DayDemand} units
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
