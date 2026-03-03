import { useState } from 'react';
import { Package, Box, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';

interface FulfillmentOrder {
  id: string;
  orderNumber: string;
  customer: string;
  items: Array<{
    product: string;
    quantity: number;
    picked: boolean;
    packed: boolean;
  }>;
  status: 'Pending' | 'Picking' | 'Packing' | 'Ready to Ship';
}

export function OrderFulfillment() {
  const [orders] = useState<FulfillmentOrder[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'ABC Corporation',
      items: [
        { product: 'Product A', quantity: 50, picked: false, packed: false },
        { product: 'Product B', quantity: 25, picked: false, packed: false },
      ],
      status: 'Pending',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'XYZ Enterprises',
      items: [
        { product: 'Product A', quantity: 100, picked: true, packed: false },
      ],
      status: 'Packing',
    },
  ]);

  const handlePickItem = (orderId: string, itemIndex: number) => {
    console.log(`Pick item ${itemIndex} for order ${orderId}`);
  };

  const handlePackItem = (orderId: string, itemIndex: number) => {
    console.log(`Pack item ${itemIndex} for order ${orderId}`);
  };

  const getStatusColor = (status: FulfillmentOrder['status']) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      Picking: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      Packing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'Ready to Ship': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Order Fulfillment
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Pick, pack, and prepare orders for shipping
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Orders</p>
              <Package className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {orders.filter(o => o.status === 'Pending').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Picking</p>
              <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {orders.filter(o => o.status === 'Picking').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Packing</p>
              <Box className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {orders.filter(o => o.status === 'Packing').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Ready to Ship</p>
              <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {orders.filter(o => o.status === 'Ready to Ship').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{order.orderNumber}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{order.customer}</p>
                </div>
                <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.product}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {item.quantity} units
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={item.picked}
                          onCheckedChange={() => handlePickItem(order.id, idx)}
                        />
                        <span className="text-sm">Picked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={item.packed}
                          onCheckedChange={() => handlePackItem(order.id, idx)}
                          disabled={!item.picked}
                        />
                        <span className="text-sm">Packed</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button className="w-full" size="lg">
                Prepare for Shipping
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
