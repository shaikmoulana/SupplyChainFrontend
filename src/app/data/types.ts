export interface ApiProduct {
  productId: number;
  productName: string;
  category: string;
  unitPrice: number;
}

export interface InventoryRecommendation {
  productId: number;
  currentStock: number;
  reorderLevel: number;
  leadTimeDays: number;
  status: 'RISK' | 'OK';
}

export interface Forecast {
  date: string;
  actualQty: number;
  predictedQty: number;
}
