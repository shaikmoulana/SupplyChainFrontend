import { TrendingUp, Brain, Target, BarChart3, Activity } from 'lucide-react';
import { products, combinedPredictions, getTotalPredictedDemand, getAverageDailyDemand } from '../data/mockData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';

export function Forecast() {
  const productA = products.find(p => p.id === 'A')!;
  const productB = products.find(p => p.id === 'B')!;

  const avgConfidenceA = productA.next7DaysPredictions.reduce((sum, p) => sum + p.confidence, 0) / productA.next7DaysPredictions.length;
  const avgConfidenceB = productB.next7DaysPredictions.reduce((sum, p) => sum + p.confidence, 0) / productB.next7DaysPredictions.length;
  const overallConfidence = (avgConfidenceA + avgConfidenceB) / 2;

  const totalDemandA = getTotalPredictedDemand(productA);
  const totalDemandB = getTotalPredictedDemand(productB);
  const totalDemand = totalDemandA + totalDemandB;

  // Comparison data
  const comparisonData = [
    { metric: 'Total Predicted (7 days)', productA: totalDemandA, productB: totalDemandB },
    { metric: 'Avg Daily Demand', productA: getAverageDailyDemand(productA), productB: getAverageDailyDemand(productB) },
    { metric: 'Current Stock', productA: productA.onHand, productB: productB.onHand },
    { metric: 'Reorder Level', productA: productA.reorderLevel, productB: productB.reorderLevel },
  ];

  return (
    <div className="space-y-6">
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
              AI Powered
            </span>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Prediction Confidence
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {overallConfidence.toFixed(1)}%
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Average across all products
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
            {totalDemand}
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

      {/* Combined 7-Day Forecast */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          7-Day Demand Forecast Comparison
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={combinedPredictions}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#10b981" 
              strokeWidth={2}
              fill="url(#colorTotal)"
              name="Total Demand"
            />
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
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Product Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Product Metrics Comparison
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="metric" 
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
            <Bar 
              dataKey="productA" 
              fill="#3b82f6" 
              name="Product A"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="productB" 
              fill="#8b5cf6" 
              name="Product B"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence Levels */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Daily Prediction Confidence Levels
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
              strokeWidth={3}
              name="Product A Confidence"
              dot={{ fill: '#3b82f6', r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="productB" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              name="Product B Confidence"
              dot={{ fill: '#8b5cf6', r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Product A Avg Confidence</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{avgConfidenceA.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Product B Avg Confidence</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{avgConfidenceB.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Detailed Product Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map(product => {
          const totalPred = getTotalPredictedDemand(product);
          const avgDaily = getAverageDailyDemand(product);
          const daysOfStock = product.onHand / avgDaily;
          
          return (
            <div 
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {product.name} Analysis
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">7-Day Predicted Demand</span>
                  <span className="font-bold text-gray-900 dark:text-white">{totalPred} units</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Daily Demand</span>
                  <span className="font-bold text-gray-900 dark:text-white">{avgDaily.toFixed(1)} units</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Stock</span>
                  <span className="font-bold text-gray-900 dark:text-white">{product.onHand} units</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <span className="text-sm text-blue-600 dark:text-blue-400">Days of Stock</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{daysOfStock.toFixed(1)} days</span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded-lg ${
                  daysOfStock < product.leadTime 
                    ? 'bg-red-50 dark:bg-red-900/10' 
                    : 'bg-green-50 dark:bg-green-900/10'
                }`}>
                  <span className={`text-sm ${
                    daysOfStock < product.leadTime 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    Status
                  </span>
                  <span className={`font-bold ${
                    daysOfStock < product.leadTime 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {daysOfStock < product.leadTime ? 'Reorder Needed' : 'Adequate Stock'}
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
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              Product A Demand Pattern
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Predicted to have peak demand on Day 4 (Feb 9) with {Math.max(...productA.next7DaysPredictions.map(p => p.predictedDemand))} units. 
              Total weekly demand: {totalDemandA} units with {avgConfidenceA.toFixed(1)}% average confidence.
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
              Product B Demand Pattern
            </h4>
            <p className="text-sm text-purple-800 dark:text-purple-300">
              Predicted to have peak demand on Day 7 (Feb 12) with {Math.max(...productB.next7DaysPredictions.map(p => p.predictedDemand))} units. 
              Total weekly demand: {totalDemandB} units with {avgConfidenceB.toFixed(1)}% average confidence.
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
              High Prediction Confidence
            </h4>
            <p className="text-sm text-green-800 dark:text-green-300">
              Both products showing strong prediction confidence above 88%, enabling reliable 
              inventory planning and reorder decisions for the next week.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
              Combined Weekly Outlook
            </h4>
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Total predicted demand across both products: {totalDemand} units over 7 days. 
              Monitor stock levels closely to prevent stockouts during peak demand days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
