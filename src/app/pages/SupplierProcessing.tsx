import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { purchaseOrders } from '../data/mockData';

type POStatus = 'Accepted' | 'Rejected' | 'In Production' | 'Dispatched';

export function SupplierProcessing() {
  const [orders, setOrders] = useState(
    purchaseOrders.filter(po => po.status === 'Pending' || po.status === 'Approved')
  );

  const handleUpdateStatus = (poId: string, newStatus: POStatus) => {
    console.log(`Update PO ${poId} to ${newStatus}`);
    // In a real app, this would call an API
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Supplier Processing
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage purchase orders and dispatch status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Orders</p>
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {orders.filter(o => o.status === 'Pending').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">In Production</p>
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Dispatched</p>
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {order.poNumber}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {order.supplierName}
                  </p>
                </div>
                <Badge>{order.status}</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Items</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.totalItems}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.totalQuantity}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${order.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'Accepted')}>
                  Accept
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order.id, 'In Production')}>
                  In Production
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order.id, 'Dispatched')}>
                  Dispatch
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(order.id, 'Rejected')}>
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
