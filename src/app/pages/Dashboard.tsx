import { useEffect, useMemo, useState } from 'react';
import { api } from '../components/api';
import { Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { AlertCard } from '../components/AlertCard';
import { products, combinedPredictions, getTotalPredictedDemand, alerts, Product } from '../data/mockData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ApiProduct, Forecast, InventoryRecommendation } from '../data/types';

export function Dashboard() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [forecastMap, setForecastMap] = useState<Record<number, Forecast[]>>({});
  const [inventoryMap, setInventoryMap] = useState<Record<number, InventoryRecommendation>>({});
  // const [combinedPredictions, setCombinedPredictions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const productsRes = await api.get<ApiProduct[]>('/api/Product');
        const inventoryRes = await api.get<InventoryRecommendation[]>('/api/inventory/recommendations');

        setProducts(productsRes.data);

        // Build inventory map
        const invMap: Record<number, InventoryRecommendation> = {};
        inventoryRes.data.forEach(i => {
          invMap[i.productId] = i;
        });
        setInventoryMap(invMap);

        // Fetch forecast PER PRODUCT
        const forecastEntries = await Promise.all(
          productsRes.data.map(p =>
            api.get<Forecast[]>(`/api/forecast/${p.productId}`)
              .then(res => [p.productId, res.data] as const)
          )
        );

        const fMap: Record<number, Forecast[]> = {};
        forecastEntries.forEach(([productId, data]) => {
          fMap[productId] = data;
        });

        setForecastMap(fMap);

      } catch (err) {
        console.error('Dashboard load failed', err);
      }
    }


    fetchDashboardData();
  }, []);

  const totalProducts = products.length;

  const totalPredictedDemand = useMemo(() => {
    return products.reduce((sum, product) => {
      const forecasts = forecastMap[product.productId] || [];
      const productTotal = forecasts.reduce(
        (s, f) => s + f.predictedQty,
        0
      );
      return sum + productTotal;
    }, 0);
  }, [products, forecastMap]);

  const getProductTotalDemand = (productId: number) =>
    forecastMap[productId]?.reduce(
      (sum, f) => sum + f.predictedQty,
      0
    ) ?? 0;
    
    const getTotalPredictedDemand = (productId: number) =>
      forecastMap[productId]?.reduce(
        (sum, f) => sum + f.predictedQty,
        0
      ) ?? 0;
      
 const productsNeedingReorder = useMemo(() => {
  return Object.values(inventoryMap).filter(item => {
    const predictedDemand = getTotalPredictedDemand(item.productId);

    return (
      item.currentStock <= item.reorderLevel ||
      predictedDemand > item.currentStock
    );
  }).length;
}, [inventoryMap, forecastMap]);


  const confidenceChartData = useMemo(() => {
    if (!products.length) return [];

    const dates =
      forecastMap[products[0].productId]?.map(f =>
        f.date.split('T')[0]
      ) || [];

    return dates.map((date, index) => {
      const row: any = { date };

      products.forEach(product => {
        const forecast = forecastMap[product.productId]?.[index];
        row[product.productName] = forecast?.predictedQty ?? 0;
      });

      return row;
    });
  }, [products, forecastMap]);

  const productDemandSummary = useMemo(() => {
    return products
      .map(product => {
        const total =
          forecastMap[product.productId]?.reduce(
            (sum, f) => sum + f.predictedQty,
            0
          ) ?? 0;

        return `${product.productName}: ${Math.round(total)} units`;
      })
      .join(', ');
  }, [products, forecastMap]);

const combinedPredictions = useMemo(() => {
  if (!products.length) return [];

  const days = forecastMap[products[0].productId]?.length || 0;

  return Array.from({ length: days }).map((_, idx) => {
    const row: any = {
      date: forecastMap[products[0].productId][idx].date,
    };

    let total = 0;

    products.forEach(product => {
      const qty = forecastMap[product.productId]?.[idx]?.predictedQty || 0;
      row[product.productId] = qty;
      total += qty;
    });

    row.total = total;
    return row;
  });
}, [products, forecastMap]);

const COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#ec4899', '#22c55e'];
const BAR_COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#22c55e', '#ec4899'];

const BG_COLORS = [
  'bg-blue-50 dark:bg-blue-900/10',
  'bg-purple-50 dark:bg-purple-900/10',
  'bg-orange-50 dark:bg-orange-900/10',
  'bg-green-50 dark:bg-green-900/10',
  'bg-pink-50 dark:bg-pink-900/10',
];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          7-Day AI Demand Prediction Overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="7-Day Predicted Demand"
          value={`${totalPredictedDemand.toFixed(0)} units`}
          icon={TrendingUp}
          trend={{
            value: productDemandSummary,
            isPositive: true,
          }}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <KPICard
          title="Products Needing Reorder"
          value={productsNeedingReorder}
          icon={AlertTriangle}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* Main Prediction Chart - Combined */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          7-Day Demand Predictions - All Products
        </h2>
      <ResponsiveContainer width="100%" height={350}>
  <LineChart data={combinedPredictions}>
    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />

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

    {/* 🔥 Dynamic product lines */}
    {products.map((product, index) => (
      <Line
        key={product.productId}
        type="monotone"
        dataKey={product.productId}
        stroke={COLORS[index % COLORS.length]}
        strokeWidth={3}
        name={product.productName}
        dot={{ fill: COLORS[index % COLORS.length], r: 5 }}
      />
    ))}

    {/* Total demand line */}
    <Line
      type="monotone"
      dataKey="total"
      stroke="#10b981"
      strokeWidth={2}
      strokeDasharray="5 5"
      name="Total Demand"
      dot={{ fill: '#10b981', r: 4 }}
    />
  </LineChart>
</ResponsiveContainer>
</div>

      {/* Individual Product Charts */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {products.map((product, index) => {
    const color = BAR_COLORS[index % BAR_COLORS.length];
    const bgColor = BG_COLORS[index % BG_COLORS.length];

    return (
      <div
        key={product.productId}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {product.productName} – 7-Day Predictions
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={forecastMap[product.productId] || []}>
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

            <Bar
              dataKey="predictedQty"
              fill={color}
              name="Predicted Demand (units)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className={`mt-4 p-3 rounded-lg ${bgColor}`}>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Total 7-Day Demand:
            </span>
            <span className="font-semibold" style={{ color }}>
              {getProductTotalDemand(product.productId)} units
            </span>
          </div>

          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600 dark:text-gray-400">
              Current Stock:
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {inventoryMap[product.productId]?.currentStock ?? 0} units
            </span>
          </div>
        </div>
      </div>
    );
  })}
</div>


      {/* Prediction Confidence Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Prediction Confidence Levels
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={confidenceChartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
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
                stroke={index === 0 ? '#3b82f6' : '#8b5cf6'}
                strokeWidth={2}
                dot={{ r: 5 }}
                name={`${product.productName} Prediction`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Inventory Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                title={alert.title}
                description={alert.description}
                severity={alert.severity}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
