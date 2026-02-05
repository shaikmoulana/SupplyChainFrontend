import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products, getTotalPredictedDemand } from '../data/mockData';

export function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Products</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View product details and 7-day predictions
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => {
          const totalPredicted = getTotalPredictedDemand(product);
          const stockPercentage = (product.onHand / product.reorderLevel) * 100;
          const willStockout = totalPredicted > product.onHand;
          
          const stockStatus = willStockout
            ? { label: 'Risk of Stockout', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
            : stockPercentage <= 100 
            ? { label: 'Below Reorder Level', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' }
            : { label: 'Good Stock', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };

          return (
            <div
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
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
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Unit Price</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    ${product.unitPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Current Stock</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {product.onHand} units
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Reorder Level</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {product.reorderLevel} units
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Lead Time</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {product.leadTime} days
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">7-Day Predicted Demand</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {totalPredicted} units
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No products found</p>
        </div>
      )}
    </div>
  );
}
