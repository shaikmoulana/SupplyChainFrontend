import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, TrendingUp, Clock, AlertCircle, Target } from 'lucide-react';
import { products, getTotalPredictedDemand, getAverageDailyDemand, getRecommendedReorderQuantity } from '../data/mockData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts';

interface Prediction {
  day: string;
  date: string;
  predictedDemand: number;
  confidence: number;
}

interface ProductDetailsUI {
  id: number;
  name: string;
  category: string;
  unitPrice: number;
  onHand: number;
  reorderLevel: number;
  leadTime: number;
  next7DaysPredictions: Prediction[];
}

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailsUI | null>(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    if (id) loadProductDetails(Number(id));
  }, [id]);

  const loadProductDetails = async (productId: number) => {
    try {
      const [productRes, inventoryRes, forecastRes] = await Promise.all([
        fetch('http://localhost:5281/api/Product'),
        fetch('http://localhost:5281/api/inventory/recommendations'),
        fetch(`http://localhost:5281/api/forecast/${productId}`)
      ]);

      const products = await productRes.json();
      const inventory = await inventoryRes.json();
      const forecast = await forecastRes.json();

      const p = products.find((x: any) => x.productId === productId);
      const inv = inventory.find((i: any) => i.productId === productId);

      
      if (!p) return;

      const predictions: Prediction[] = forecast.map((f: any, index: number) => ({
        day: new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' }),
        date: new Date(f.date).toLocaleDateString(),
        predictedDemand: Math.round(f.predictedQty),
        confidence: 90 + (index % 5) // mock confidence until backend provides it
      }));

      setProduct({
        id: p.productId,
        name: p.productName,
        category: p.category,
        unitPrice: p.unitPrice,
        onHand: inv?.currentStock ?? 0,
        reorderLevel: inv?.recommendedReorderQty ?? 0,
        leadTime: 7,
        next7DaysPredictions: predictions
      });
    } catch (err) {
      console.error('Failed to load product details', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400">Loading product...</p>;
  }


  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The product you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }


  // 🔢 Derived metrics (replacing mockData helpers)
  const totalPredicted = product.next7DaysPredictions.reduce(
    (sum, p) => sum + p.predictedDemand,
    0
  );
  const avgDailyDemand = totalPredicted / 7;
  const recommendedQty = Math.max(totalPredicted - product.onHand, 0);
  const needsReorder = recommendedQty > 0;
  const daysOfStock = product.onHand / avgDailyDemand;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {product.category} • ${product.unitPrice.toFixed(2)} per unit
            </p>
          </div>
          {needsReorder && (
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
              Reorder Recommended
            </span>
          )}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Stock</p>
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {product.onHand}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">units available</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">7-Day Prediction</p>
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {totalPredicted}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">units demand</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Days of Stock</p>
            <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {daysOfStock.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">at current rate</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Daily Demand</p>
            <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {avgDailyDemand.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">units per day</p>
        </div>
      </div>

      {/* Main Prediction Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          7-Day Demand Predictions
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={product.next7DaysPredictions}>
            <defs>
              <linearGradient id={`colorDemand${product.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={product.id === 1 ? '#3b82f6' : '#8b5cf6'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={product.id === 1 ? '#3b82f6' : '#8b5cf6'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="date" 
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
              label={{ value: 'Predicted Units', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              className="text-xs text-gray-600 dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
              domain={[80, 100]}
              label={{ value: 'Confidence %', angle: 90, position: 'insideRight' }}
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
              yAxisId="left"
              type="monotone" 
              dataKey="predictedDemand" 
              stroke={product.id === 1 ? '#3b82f6' : '#8b5cf6'}
              strokeWidth={3}
              fill={`url(#colorDemand${product.id})`}
              name="Predicted Demand"
              dot={{ fill: product.id === 1 ? '#3b82f6' : '#8b5cf6', r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="confidence" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Confidence %"
              dot={{ fill: '#10b981', r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Day-by-Day Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Day-by-Day Prediction Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {product.next7DaysPredictions.map((prediction, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {prediction.day}
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {prediction.date}
                </p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {prediction.predictedDemand}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  units
                </p>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {prediction.confidence}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Stock Analysis
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Current Stock Level</span>
              <span className="font-semibold text-gray-900 dark:text-white">{product.onHand} units</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Reorder Level</span>
              <span className="font-semibold text-gray-900 dark:text-white">{product.reorderLevel} units</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Lead Time</span>
              <span className="font-semibold text-gray-900 dark:text-white">{product.leadTime} days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <span className="text-sm text-blue-600 dark:text-blue-400">Days of Stock Remaining</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{daysOfStock.toFixed(1)} days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <span className="text-sm text-purple-600 dark:text-purple-400">7-Day Total Demand</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{totalPredicted} units</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Prediction Confidence
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={product.next7DaysPredictions}>
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="confidence" 
                fill="#10b981" 
                name="Confidence %"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Average Confidence:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {(product.next7DaysPredictions.reduce((sum, p) => sum + p.confidence, 0) / product.next7DaysPredictions.length).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {needsReorder && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
            Reorder Recommendation
          </h3>
          <p className="text-sm text-red-800 dark:text-red-300 mb-4">
            Based on the 7-day prediction ({totalPredicted} units) and current stock ({product.onHand} units), 
            you have only {daysOfStock.toFixed(1)} days of inventory remaining. With a lead time of {product.leadTime} days, 
            immediate action is recommended.
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 dark:text-red-400">Recommended Order Quantity:</p>
              <p className="text-2xl font-semibold text-red-900 dark:text-red-200 mt-1">
                {recommendedQty} units
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Estimated cost: ${(recommendedQty * product.unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Create Purchase Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}