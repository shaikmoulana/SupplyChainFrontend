import { useState } from 'react';
import { PackageCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { purchaseOrders } from '../data/mockData';

export function GoodsInward() {
  const [incomingOrders] = useState(
    purchaseOrders.filter(po => po.status === 'Shipped')
  );

  const handleVerifyGoods = (poId: string, receivedQty: number, orderedQty: number) => {
    console.log(`Verify goods for PO ${poId}: Received ${receivedQty} / Ordered ${orderedQty}`);
    // In a real app, this would call an API to update inventory
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Goods Inward
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Verify and receive incoming shipments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Incoming Shipments</p>
              <PackageCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {incomingOrders.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Verified Today</p>
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Discrepancies</p>
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Incoming Orders */}
      <div className="space-y-4">
        {incomingOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{order.poNumber}</CardTitle>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Supplier</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.supplierName}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Expected Quantity</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.totalQuantity} units</p>
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.productName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ordered: {item.quantity} units
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Received Quantity</Label>
                        <Input
                          type="number"
                          placeholder={item.quantity.toString()}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          className="w-full"
                          onClick={() => handleVerifyGoods(order.id, item.quantity, item.quantity)}
                        >
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => handleVerifyGoods(order.id, order.totalQuantity, order.totalQuantity)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Receiving
              </Button>
            </CardContent>
          </Card>
        ))}

        {incomingOrders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <PackageCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No incoming shipments at this time
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
