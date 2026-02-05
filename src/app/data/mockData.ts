// Mock data for 2 products with 7-day predictions

export interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  onHand: number;
  reorderLevel: number;
  leadTime: number;
  next7DaysPredictions: Array<{
    day: string;
    date: string;
    predictedDemand: number;
    confidence: number; // percentage
  }>;
}

export const products: Product[] = [
  {
    id: 'A',
    name: 'Product A',
    category: 'Category A',
    unitPrice: 99.99,
    onHand: 150,
    reorderLevel: 100,
    leadTime: 7,
    next7DaysPredictions: [
      { day: 'Day 1', date: 'Feb 6', predictedDemand: 25, confidence: 92 },
      { day: 'Day 2', date: 'Feb 7', predictedDemand: 28, confidence: 90 },
      { day: 'Day 3', date: 'Feb 8', predictedDemand: 22, confidence: 88 },
      { day: 'Day 4', date: 'Feb 9', predictedDemand: 30, confidence: 85 },
      { day: 'Day 5', date: 'Feb 10', predictedDemand: 27, confidence: 87 },
      { day: 'Day 6', date: 'Feb 11', predictedDemand: 24, confidence: 89 },
      { day: 'Day 7', date: 'Feb 12', predictedDemand: 26, confidence: 91 },
    ],
  },
  {
    id: 'B',
    name: 'Product B',
    category: 'Category B',
    unitPrice: 149.99,
    onHand: 45,
    reorderLevel: 50,
    leadTime: 10,
    next7DaysPredictions: [
      { day: 'Day 1', date: 'Feb 6', predictedDemand: 15, confidence: 94 },
      { day: 'Day 2', date: 'Feb 7', predictedDemand: 18, confidence: 93 },
      { day: 'Day 3', date: 'Feb 8', predictedDemand: 20, confidence: 91 },
      { day: 'Day 4', date: 'Feb 9', predictedDemand: 17, confidence: 89 },
      { day: 'Day 5', date: 'Feb 10', predictedDemand: 16, confidence: 90 },
      { day: 'Day 6', date: 'Feb 11', predictedDemand: 19, confidence: 92 },
      { day: 'Day 7', date: 'Feb 12', predictedDemand: 21, confidence: 93 },
    ],
  },
];

// Combined predictions for dashboard overview
export const combinedPredictions = [
  { 
    date: 'Feb 6',
    productA: 25, 
    productB: 15,
    total: 40
  },
  { 
    date: 'Feb 7',
    productA: 28, 
    productB: 18,
    total: 46
  },
  { 
    date: 'Feb 8',
    productA: 22, 
    productB: 20,
    total: 42
  },
  { 
    date: 'Feb 9',
    productA: 30, 
    productB: 17,
    total: 47
  },
  { 
    date: 'Feb 10',
    productA: 27, 
    productB: 16,
    total: 43
  },
  { 
    date: 'Feb 11',
    productA: 24, 
    productB: 19,
    total: 43
  },
  { 
    date: 'Feb 12',
    productA: 26, 
    productB: 21,
    total: 47
  },
];

// Calculate totals and recommendations
export const getTotalPredictedDemand = (product: Product) => {
  return product.next7DaysPredictions.reduce((sum, day) => sum + day.predictedDemand, 0);
};

export const getAverageDailyDemand = (product: Product) => {
  const total = getTotalPredictedDemand(product);
  return total / product.next7DaysPredictions.length;
};

export const getStockoutRisk = (product: Product) => {
  const totalDemand = getTotalPredictedDemand(product);
  return totalDemand > product.onHand;
};

export const getRecommendedReorderQuantity = (product: Product) => {
  const avgDaily = getAverageDailyDemand(product);
  const daysOfStock = product.onHand / avgDaily;
  
  if (daysOfStock < product.leadTime) {
    // Need to reorder urgently
    return Math.ceil(avgDaily * (product.leadTime + 14)); // 2 weeks buffer
  }
  return 0;
};

export const alerts = products
  .map(product => {
    const totalDemand = getTotalPredictedDemand(product);
    const avgDaily = getAverageDailyDemand(product);
    const daysOfStock = product.onHand / avgDaily;
    const stockoutRisk = getStockoutRisk(product);
    
    if (daysOfStock < product.leadTime) {
      return {
        id: product.id,
        title: `Critical: ${product.name} Stock Alert`,
        description: `Only ${daysOfStock.toFixed(1)} days of stock remaining. Predicted to need ${totalDemand} units over next 7 days.`,
        severity: 'critical' as const,
        product: product.name,
      };
    } else if (product.onHand < product.reorderLevel) {
      return {
        id: product.id,
        title: `${product.name} Below Reorder Level`,
        description: `Current stock (${product.onHand} units) is below reorder level (${product.reorderLevel} units).`,
        severity: 'warning' as const,
        product: product.name,
      };
    } else if (stockoutRisk) {
      return {
        id: product.id,
        title: `${product.name} High Demand Alert`,
        description: `Predicted demand (${totalDemand} units) exceeds current stock (${product.onHand} units).`,
        severity: 'warning' as const,
        product: product.name,
      };
    }
    return null;
  })
  .filter(alert => alert !== null);

export const recommendedReorders = products
  .map(product => {
    const recommendedQty = getRecommendedReorderQuantity(product);
    if (recommendedQty > 0) {
      const avgDaily = getAverageDailyDemand(product);
      const daysOfStock = product.onHand / avgDaily;
      
      return {
        ...product,
        recommendedQuantity: recommendedQty,
        urgency: daysOfStock < product.leadTime ? 'critical' : 'warning',
        daysOfStock: daysOfStock,
      };
    }
    return null;
  })
  .filter(item => item !== null);
