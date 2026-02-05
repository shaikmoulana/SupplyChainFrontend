import { Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { KPICard } from '../components/KPICard';
import { AlertCard } from '../components/AlertCard';
import { products, combinedPredictions, getTotalPredictedDemand, alerts } from '../data/mockData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const totalProducts = products.length;
  const productA = products.find(p => p.id === 'A')!;
  const productB = products.find(p => p.id === 'B')!;
  
  const totalPredictedDemand = getTotalPredictedDemand(productA) + getTotalPredictedDemand(productB);
  const productsNeedingReorder = products.filter(p => p.onHand < p.reorderLevel).length;

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
          value={`${totalPredictedDemand} units`}
          icon={TrendingUp}
          trend={{ value: 'Product A: 182 units, Product B: 126 units', isPositive: true }}
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
            <Line 
              type="monotone" 
              dataKey="productA" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Product A"
              dot={{ fill: '#3b82f6', r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="productB" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              name="Product B"
              dot={{ fill: '#8b5cf6', r: 6 }}
            />
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
        {/* Product A */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Product A - 7-Day Predictions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productA.next7DaysPredictions}>
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
                dataKey="predictedDemand" 
                fill="#3b82f6" 
                name="Predicted Demand (units)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total 7-Day Demand:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {getTotalPredictedDemand(productA)} units
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600 dark:text-gray-400">Current Stock:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {productA.onHand} units
              </span>
            </div>
          </div>
        </div>

        {/* Product B */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Product B - 7-Day Predictions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productB.next7DaysPredictions}>
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
                dataKey="predictedDemand" 
                fill="#8b5cf6" 
                name="Predicted Demand (units)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total 7-Day Demand:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                {getTotalPredictedDemand(productB)} units
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600 dark:text-gray-400">Current Stock:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {productB.onHand} units
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Confidence Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Prediction Confidence Levels
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productA.next7DaysPredictions.map((pred, idx) => ({
            date: pred.date,
            productA: pred.confidence,
            productB: productB.next7DaysPredictions[idx].confidence,
          }))}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="date" 
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
              domain={[80, 100]}
              label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="productA" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Product A Confidence"
              dot={{ fill: '#3b82f6', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="productB" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Product B Confidence"
              dot={{ fill: '#8b5cf6', r: 5 }}
            />
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
