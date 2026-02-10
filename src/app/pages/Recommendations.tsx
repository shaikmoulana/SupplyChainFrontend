import { AlertCircle, Clock, TrendingUp, Package, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useMemo } from 'react';

interface Product {
  productId: number;
  productName: string;
  unitPrice: number;
}

interface Forecast {
  date: string;
  predictedQty: number;
}

interface InventoryRecommendation {
  productId: number;
  currentStock: number;
  reorderLevel: number;
  leadTimeDays: number;
  status: 'RISK' | 'OK';
}

interface RecommendationItem {
  productId: number;
  name: string;
  currentStock: number;
  leadTime: number;
  daysOfStock: number;
  avgDaily: number;
  total7DayDemand: number;
  predictedQty: number;
  unitPrice: number;
  category: string;
  urgency: 'critical' | 'warning';
}


export function Recommendations() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [forecastMap, setForecastMap] = React.useState<Record<number, Forecast[]>>({});
  const [inventoryMap, setInventoryMap] = React.useState<Record<number, InventoryRecommendation>>({});
  React.useEffect(() => {
    async function loadData() {
      const productsRes = await axios.get<Product[]>('http://localhost:5281/api/Product');
      setProducts(productsRes.data);
      console.log('Products loaded:', productsRes.data);

      const inventoryRes = await axios.get<InventoryRecommendation[]>(
        'http://localhost:5281/api/inventory/recommendations'
      );

      const inventoryObj: Record<number, InventoryRecommendation> = {};
      inventoryRes.data.forEach(i => (inventoryObj[i.productId] = i));
      setInventoryMap(inventoryObj);

      const forecastObj: Record<number, Forecast[]> = {};
      for (const p of productsRes.data) {
        const res = await axios.get<Forecast[]>(
          `http://localhost:5281/api/forecast/${p.productId}`
        );
        forecastObj[p.productId] = res.data;
      }
      setForecastMap(forecastObj);
    }

    loadData();
  }, []);

  const navigate = useNavigate();

  const SAFETY_BUFFER_DAYS = 2;

  const recommendations = useMemo<RecommendationItem[]>(() => {
    return products
      .map(product => {
        const inventory = inventoryMap[product.productId];
        if (!inventory) return null;

        const forecast = forecastMap[product.productId] || [];
        if (forecast.length === 0) return null;

        const total7DayDemand = forecast.reduce(
          (sum, f) => sum + f.predictedQty,
          0
        );

        const avgDaily = total7DayDemand / forecast.length;
        if (avgDaily === 0) return null;

        const predictedDuringLead =
          avgDaily * inventory.leadTimeDays;

        if (predictedDuringLead <= inventory.currentStock) {
          return null;
        }

        const daysOfStock =
          inventory.currentStock / avgDaily;

        const predictedQty = Math.ceil(
          predictedDuringLead +
          avgDaily * SAFETY_BUFFER_DAYS -
          inventory.currentStock
        );

        const urgency: 'critical' | 'warning' =
          daysOfStock < inventory.leadTimeDays
            ? 'critical'
            : 'warning';

        return {
          productId: product.productId,
          name: product.productName,
          currentStock: inventory.currentStock,
          leadTime: inventory.leadTimeDays,
          daysOfStock,
          avgDaily,
          total7DayDemand,
          predictedQty: forecastMap[product.productId]?.[0]?.predictedQty || 0,
          urgency,
        };
      })
      .filter(
        (item): item is RecommendationItem => item !== null
      );
  }, [products, forecastMap, inventoryMap]);





  /* -----------------------
     Summary Metrics
  ----------------------- */

  const criticalItems = useMemo(
    () => recommendations.filter(r => r.urgency === 'critical'),
    [recommendations]
  );

  const getTotalPredictedDemand = (productId: number) =>
    (forecastMap[productId] || []).reduce(
      (sum, f) => sum + f.predictedQty,
      0
    );

  const getAverageDailyDemand = (productId: number) => {
    const total = getTotalPredictedDemand(productId);
    return total / 7;
  };

  
  const productPriceMap = useMemo(() => {
    const map: Record<number, number> = {};
    products.forEach(p => {
      map[p.productId] = p.unitPrice;
    });
    return map;
  }, [products]);
  

  const totalReorderValue = useMemo(() => {
    return recommendations.reduce((sum, item) => {
      const totalPredicted = getTotalPredictedDemand(item.productId);
      const unitPrice = productPriceMap[item.productId] ?? 0;
      const total= sum + totalPredicted * unitPrice;
      console.log(total, item.name, totalPredicted, unitPrice);
      return total;
    }, 0);
  }, [recommendations, productPriceMap]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Inventory Recommendations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          AI-powered reorder suggestions based on 7-day demand predictions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Products to Reorder</p>
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {recommendations.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {criticalItems.length} critical
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Order Value</p>
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            ${totalReorderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Recommended investment
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Products Tracked</p>
            <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {products.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total inventory items
          </p>
        </div>
      </div>

      {/* Critical Alert */}
      {criticalItems.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-1">
                Critical Stock Alert
              </h3>
              <p className="text-sm text-red-800 dark:text-red-300">
                {criticalItems.length} product{criticalItems.length > 1 ? 's have' : ' has'} insufficient stock
                to cover predicted demand and lead time. Immediate action required to prevent stockouts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((item) => {
            const totalPredicted = getTotalPredictedDemand(item.productId);
            const avgDaily = getAverageDailyDemand(item.productId);
            const orderValue = item.predictedQty * item.unitPrice;

            return (
              <div
                key={item.productId}
                className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-6 ${item.urgency === 'critical'
                  ? 'border-red-300 dark:border-red-700'
                  : 'border-yellow-300 dark:border-yellow-700'
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${item.urgency === 'critical'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                        {item.urgency === 'critical' ? (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {item.urgency.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.category}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/products/${item.productId}`)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Stock</p>
                    <p className={`text-lg font-bold ${item.urgency === 'critical'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                      {item.currentStock} units
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">7-Day Demand</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {totalPredicted} units
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Days of Stock</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {item.daysOfStock.toFixed(1)} days
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lead Time</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.leadTime} days
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${item.urgency === 'critical'
                  ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800'
                  : 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-semibold mb-1 ${item.urgency === 'critical'
                        ? 'text-red-900 dark:text-red-200'
                        : 'text-yellow-900 dark:text-yellow-200'
                        }`}>
                        Recommended Order Quantity
                      </p>
                      <p className={`text-3xl font-bold ${item.urgency === 'critical'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                        {getTotalPredictedDemand(item.productId)} units
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Estimated cost: ${totalReorderValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <button className={`px-6 py-3 text-white rounded-lg transition-colors font-semibold ${item.urgency === 'critical'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-yellow-600 hover:bg-yellow-700'
                      }`}>
                      Create Purchase Order
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <strong>Analysis:</strong> With {item.daysOfStock.toFixed(1)} days of stock remaining and a {item.leadTime}-day lead time,
                    your stock will be depleted before the next shipment arrives. The AI predicts {totalPredicted} units of demand
                    over the next 7 days (avg {avgDaily.toFixed(1)} units/day).
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-2">
            All Products Well Stocked
          </h3>
          <p className="text-sm text-green-800 dark:text-green-300">
            Based on the 7-day demand predictions, all products have sufficient inventory levels.
            No immediate reorders are required at this time.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      {recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalItems.length > 0 && (
              <button className="flex items-center justify-between p-4 border-2 border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Create Critical Orders
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      For {criticalItems.length} critical item{criticalItems.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            <button className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Export Recommendations
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Download as CSV or PDF
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    View Forecast Details
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    See 7-day predictions
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                  <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Review All Products
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Check inventory status
                  </p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
