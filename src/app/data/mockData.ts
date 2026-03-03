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

// Supplier interface
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  leadTime: number;
  status: 'Active' | 'Inactive';
}

// Supplier Product with supplier-specific cost
export interface SupplierProduct {
  id: string;
  productId: string;
  productName: string;
  supplierId: string;
  category: string;
  supplierCost: number;
  moq: number; // minimum order quantity
  leadTime: number;
}

// Suppliers data
export const suppliers: Supplier[] = [
  {
    id: 'S1',
    name: 'Global Supplies Inc.',
    contactPerson: 'John Doe',
    contact: '+1 (555) 123-4567',
    email: 'sales@globalsupplies.com',
    phone: '+1 (555) 123-4567',
    address: '123 Supply St, City, Country',
    leadTime: 7,
    status: 'Active',
  },
  {
    id: 'S2',
    name: 'Premium Parts Co.',
    contactPerson: 'Jane Smith',
    contact: '+1 (555) 987-6543',
    email: 'orders@premiumparts.com',
    phone: '+1 (555) 987-6543',
    address: '456 Parts Ave, City, Country',
    leadTime: 5,
    status: 'Active',
  },
  {
    id: 'S3',
    name: 'Reliable Distributors',
    contactPerson: 'Alice Johnson',
    contact: '+1 (555) 456-7890',
    email: 'contact@reliabledist.com',
    phone: '+1 (555) 456-7890',
    address: '789 Distribute Rd, City, Country',
    leadTime: 10,
    status: 'Active',
  },
];

// Supplier Products data
export const supplierProducts: SupplierProduct[] = [
  // Global Supplies Inc. products
  {
    id: 'SP1',
    productId: 'A',
    productName: 'Product A',
    supplierId: 'S1',
    category: 'Category A',
    supplierCost: 85.00,
    moq: 50,
    leadTime: 7,
  },
  {
    id: 'SP2',
    productId: 'B',
    productName: 'Product B',
    supplierId: 'S1',
    category: 'Category B',
    supplierCost: 125.00,
    moq: 30,
    leadTime: 10,
  },
  // Premium Parts Co. products
  {
    id: 'SP3',
    productId: 'A',
    productName: 'Product A',
    supplierId: 'S2',
    category: 'Category A',
    supplierCost: 82.50,
    moq: 100,
    leadTime: 5,
  },
  {
    id: 'SP4',
    productId: 'B',
    productName: 'Product B',
    supplierId: 'S2',
    category: 'Category B',
    supplierCost: 130.00,
    moq: 50,
    leadTime: 8,
  },
  // Reliable Distributors products
  {
    id: 'SP5',
    productId: 'A',
    productName: 'Product A',
    supplierId: 'S3',
    category: 'Category A',
    supplierCost: 87.00,
    moq: 25,
    leadTime: 10,
  },
];

// Helper function to find the best supplier for a product
export const getBestSupplierForProduct = (productId: string): SupplierProduct | null => {
  const productSuppliers = supplierProducts.filter(sp => sp.productId === productId);
  
  if (productSuppliers.length === 0) return null;
  
  // Sort by cost (lowest first), then by lead time (fastest first)
  return productSuppliers.sort((a, b) => {
    if (a.supplierCost !== b.supplierCost) {
      return a.supplierCost - b.supplierCost;
    }
    return a.leadTime - b.leadTime;
  })[0];
};

// Purchase Order interface
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  totalItems: number;
  totalQuantity: number;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: Array<{
    productName: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
}

// Mock Purchase Orders data
export const purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO001',
    poNumber: 'PO-2024-001',
    supplierId: 'S1',
    supplierName: 'Global Supplies Inc.',
    orderDate: '2024-02-20T10:30:00',
    totalItems: 2,
    totalQuantity: 150,
    totalAmount: 16250.00,
    status: 'Delivered',
    items: [
      { productName: 'Product A', quantity: 100, unitCost: 85.00, totalCost: 8500.00 },
      { productName: 'Product B', quantity: 50, unitCost: 125.00, totalCost: 6250.00 },
    ],
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-002',
    supplierId: 'S2',
    supplierName: 'Premium Parts Co.',
    orderDate: '2024-02-22T14:15:00',
    totalItems: 1,
    totalQuantity: 200,
    totalAmount: 16500.00,
    status: 'Shipped',
    items: [
      { productName: 'Product A', quantity: 200, unitCost: 82.50, totalCost: 16500.00 },
    ],
  },
  {
    id: 'PO003',
    poNumber: 'PO-2024-003',
    supplierId: 'S1',
    supplierName: 'Global Supplies Inc.',
    orderDate: '2024-02-23T09:00:00',
    totalItems: 1,
    totalQuantity: 75,
    totalAmount: 9375.00,
    status: 'Approved',
    items: [
      { productName: 'Product B', quantity: 75, unitCost: 125.00, totalCost: 9375.00 },
    ],
  },
  {
    id: 'PO004',
    poNumber: 'PO-2024-004',
    supplierId: 'S3',
    supplierName: 'Reliable Distributors',
    orderDate: '2024-02-23T16:45:00',
    totalItems: 1,
    totalQuantity: 50,
    totalAmount: 4350.00,
    status: 'Pending',
    items: [
      { productName: 'Product A', quantity: 50, unitCost: 87.00, totalCost: 4350.00 },
    ],
  },
  {
    id: 'PO005',
    poNumber: 'PO-2024-005',
    supplierId: 'S2',
    supplierName: 'Premium Parts Co.',
    orderDate: '2024-02-24T11:20:00',
    totalItems: 2,
    totalQuantity: 250,
    totalAmount: 27000.00,
    status: 'Pending',
    items: [
      { productName: 'Product A', quantity: 150, unitCost: 82.50, totalCost: 12375.00 },
      { productName: 'Product B', quantity: 100, unitCost: 130.00, totalCost: 13000.00 },
    ],
  },
  {
    id: 'PO006',
    poNumber: 'PO-2024-006',
    supplierId: 'S1',
    supplierName: 'Global Supplies Inc.',
    orderDate: '2024-02-18T13:30:00',
    totalItems: 1,
    totalQuantity: 30,
    totalAmount: 3750.00,
    status: 'Cancelled',
    items: [
      { productName: 'Product B', quantity: 30, unitCost: 125.00, totalCost: 3750.00 },
    ],
  },
];

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