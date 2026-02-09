import React, { useMemo } from 'react';
import { TrendingUp, Brain, Target, BarChart3, Activity } from 'lucide-react';
import { products, combinedPredictions, getTotalPredictedDemand, getAverageDailyDemand } from '../data/mockData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import axios from 'axios';

export interface Product {
  productId: number;
  productName: string;
}

export interface Forecast {
  date: string;
  predictedQty : number;
  confidencePct?: number;
}

export interface InventoryRecommendation {
  productId: number;
  currentStock: number;
  reorderLevel: number;
  leadTimeDays: number;
  status: 'RISK' | 'OK';
}

interface ForecastProps {
  products: Product[];
  forecastMap: Record<number, Forecast[]>;
  inventoryMap: Record<number, InventoryRecommendation>;
}


export function Forecast() {
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

    // --------------------
    // Helpers
    // --------------------
    const getProductTotalDemand = (productId: number) => {
      return (forecastMap[productId] || []).reduce(
      (sum, f) => sum + f.predictedQty ,
      0
    );
  };
    // --------------------
    // Products needing reorder
    // Logic: if 7-day predicted demand > current stock => RISK
    // --------------------
    const productsNeedingReorder = useMemo(() => {
    return products.filter(p => {
      const totalDemand = getProductTotalDemand(p.productId);
      const stock = inventoryMap[p.productId]?.currentStock ?? 0;
      return totalDemand > stock;
    }).length;
  }, [products, forecastMap, inventoryMap]);

    // --------------------
    // Combined 7-day prediction chart data
    // --------------------
    const combinedChartData = useMemo(() => {
    if (!products.length) return [];

    const days = forecastMap[products[0].productId] || [];

    return days.map((day, idx) => {
      const row: Record<string, any> = {
        date: day.date,
        total: 0,
      };

      products.forEach(p => {
        const value = forecastMap[p.productId]?.[idx]?.predictedQty  ?? 0;
        row[p.productName] = value;
        row.total += value;
      });

      return row;
    });
  }, [products, forecastMap]);

    // --------------------
    // Confidence chart data (dynamic)
    // --------------------
    const confidenceChartData = useMemo(() => {
    if (!products.length) return [];

    const days = forecastMap[products[0].productId] || [];

    return days.map((day, idx) => {
      const row: Record<string, any> = { date: day.date };

      products.forEach(p => {
        row[p.productName] =
          forecastMap[p.productId]?.[idx]?.confidencePct ?? 0;
      });

      return row;
    });
  }, [products, forecastMap]);

  const getTotalPredictedDemand = (productId: number) =>
  (forecastMap[productId] || []).reduce(
    (sum, f) => sum + f.predictedQty ,
    0
  );

const getAverageDailyDemand = (productId: number) => {
  const total = getTotalPredictedDemand(productId);
  return total / 7;
};

const getPeakDemandInfo = (productId: number) => {
  const data = forecastMap[productId] || [];

  if (data.length === 0) {
    return { peak: 0, day: '-' };
  }

  const peakItem = data.reduce((max, curr) =>
    curr.predictedQty > max.predictedQty ? curr : max
  );

  return {
    peak: peakItem.predictedQty,
    day: peakItem.date,
  };
};

const getWeeklyDemand = (productId: number) =>
  (forecastMap[productId] || []).reduce(
    (sum, f) => sum + f.predictedQty,
    0
  );

const totalWeeklyDemandAllProducts = products.reduce(
  (sum, p) => sum + getWeeklyDemand(p.productId),
  0
);



    return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Forecast & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          AI-powered 7-day demand forecasting and analysis
        </p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 bg-blue-200 dark:bg-blue-900/40 px-2 py-1 rounded-full">
              7 Days
            </span>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Products Needing Reorder
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {productsNeedingReorder}
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Units across all products
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold text-purple-800 dark:text-purple-300 bg-purple-200 dark:bg-purple-900/40 px-2 py-1 rounded-full">
              7 Days
            </span>
          </div>
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-2">
            Total Predicted Demand
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {getProductTotalDemand(products[0]?.productId ?? 0).toFixed(0)}
          </p>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            units across all products
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="text-xs font-semibold text-green-800 dark:text-green-300 bg-green-200 dark:bg-green-900/40 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-2">
            Products Tracked
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {products.length}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Product A & Product B
          </p>
        </div>
      </div>


      {/* Combined Demand Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
           7-Day Demand Predictions – All Products
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={combinedChartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
              label={{ value: 'Predicted Units', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />

            {products.map((product, index) => (
              <Line
                key={product.productId}
                type="monotone"
                dataKey={product.productName}
                stroke={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'}
                strokeWidth={2}
                dot={{ r: 4 }}
                name={product.productName}
              />
            ))}

            <Line
              type="monotone"
              dataKey="total"
              stroke="#10b981"
              strokeDasharray="5 5"
              strokeWidth={2}
              fill="url(#colorTotal)"
              name="Total Demand"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    Product Metrics Comparison
  </h2>

  <ResponsiveContainer width="100%" height={350}>
    <BarChart data={combinedChartData}>
      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
      <XAxis
        dataKey="date"
        className="text-xs text-gray-600 dark:text-gray-400"
        tick={{ fill: 'currentColor' }}
      />
      <YAxis
        className="text-xs text-gray-600 dark:text-gray-400"
        tick={{ fill: 'currentColor' }}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}
      />
      <Legend />

      {products.map((product, index) => (
        <Bar
          key={product.productId}
          dataKey={product.productName}
          name={product.productName}
          radius={[8, 8, 0, 0]}
          fill={['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][index % 4]}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
</div>

{/* Detailed Product Analysis */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {products.map(product => {
    const productId = product.productId;

    const totalPred = getTotalPredictedDemand(productId);
    const avgDaily = getAverageDailyDemand(productId);

    const currentStock = inventoryMap[productId]?.currentStock ?? 0;
    const leadTime = inventoryMap[productId]?.leadTimeDays ?? 0;

    const daysOfStock =
      avgDaily > 0 ? currentStock / avgDaily : Infinity;

    const needsReorder = daysOfStock < leadTime;

    return (
      <div
        key={productId}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {product.productName} Analysis
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              7-Day Predicted Demand
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {totalPred} units
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Avg Daily Demand
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {avgDaily.toFixed(1)} units
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current Stock
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {currentStock} units
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <span className="text-sm text-blue-600 dark:text-blue-400">
              Days of Stock
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {daysOfStock === Infinity ? '∞' : daysOfStock.toFixed(1)} days
            </span>
          </div>

          <div
            className={`flex justify-between items-center p-3 rounded-lg ${
              needsReorder
                ? 'bg-red-50 dark:bg-red-900/10'
                : 'bg-green-50 dark:bg-green-900/10'
            }`}
          >
            <span
              className={`text-sm ${
                needsReorder
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}
            >
              Status
            </span>
            <span
              className={`font-bold ${
                needsReorder
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-green-600 dark:text-green-400'
              }`}
            >
              {needsReorder ? 'Reorder Needed' : 'Adequate Stock'}
            </span>
          </div>
        </div>
      </div>
    );
  })}
</div>

{/* Key Insights */}
<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
    <BarChart3 className="w-5 h-5 inline mr-2" />
    Key Insights from 7-Day Predictions
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {products.map((product, index) => {
      const productId = product.productId;
      const { peak, day } = getPeakDemandInfo(productId);
      const weeklyDemand = getWeeklyDemand(productId);

      const bgColor =
        index % 2 === 0
          ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
          : 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800';

      const textColor =
        index % 2 === 0
          ? 'text-blue-900 dark:text-blue-200'
          : 'text-purple-900 dark:text-purple-200';

      return (
        <div
          key={productId}
          className={`p-4 rounded-lg border ${bgColor}`}
        >
          <h4 className={`font-semibold mb-2 ${textColor}`}>
            {product.productName} Demand Pattern
          </h4>
          <p className={`text-sm ${textColor}`}>
            Predicted to have peak demand on <b>{day}</b> with <b>{peak}</b> units.
            Total weekly demand: <b>{weeklyDemand}</b> units.
          </p>
        </div>
      );
    })}

    {/* Combined Insight */}
    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800 md:col-span-2">
      <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
        Combined Weekly Outlook
      </h4>
      <p className="text-sm text-yellow-800 dark:text-yellow-300">
        Total predicted demand across all products: <b>{totalWeeklyDemandAllProducts}</b> units
        over the next 7 days. Monitor stock levels closely during peak demand periods to
        prevent stockouts.
      </p>
    </div>
  </div>
</div>

    </div>
  );
  }
