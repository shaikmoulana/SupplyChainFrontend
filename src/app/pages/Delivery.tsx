import { useState } from 'react';
import { MapPin, CheckCircle, Clock, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

interface Delivery {
  id: string;
  orderNumber: string;
  customer: string;
  address: string;
  trackingId: string;
  status: 'Scheduled' | 'In Progress' | 'Delivered' | 'Failed';
  deliveryDate?: string;
  deliveryTime?: string;
  signature?: string;
}

export function Delivery() {
  const [deliveries] = useState<Delivery[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'ABC Corporation',
      address: '123 Business St, City, Country',
      trackingId: 'TRK-20240226-001',
      status: 'In Progress',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-003',
      customer: 'DEF Company',
      address: '456 Commerce Ave, City, Country',
      trackingId: 'TRK-20240225-003',
      status: 'Delivered',
      deliveryDate: '2024-02-25',
      deliveryTime: '14:30',
    },
  ]);

  const handleConfirmDelivery = (deliveryId: string) => {
    console.log(`Confirm delivery ${deliveryId}`);
  };

  const getStatusColor = (status: Delivery['status']) => {
    const colors = {
      Scheduled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      Failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Delivery Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Confirm deliveries and manage customer handoffs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {deliveries.filter(d => d.status === 'Scheduled').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {deliveries.filter(d => d.status === 'In Progress').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Delivered Today</p>
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {deliveries.filter(d => d.status === 'Delivered').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Failed Attempts</p>
              <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {deliveries.filter(d => d.status === 'Failed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries */}
      <div className="space-y-4">
        {deliveries.map((delivery) => (
          <Card key={delivery.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{delivery.orderNumber}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{delivery.customer}</p>
                </div>
                <Badge className={getStatusColor(delivery.status)}>{delivery.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">{delivery.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tracking ID</p>
                  <p className="font-medium text-gray-900 dark:text-white">{delivery.trackingId}</p>
                </div>
              </div>

              {delivery.status === 'In Progress' && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Delivery Date</Label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery Time</Label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Signature (Optional)</Label>
                    <Input placeholder="Customer name or signature" />
                  </div>
                  <Button className="w-full" onClick={() => handleConfirmDelivery(delivery.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Delivery
                  </Button>
                </div>
              )}

              {delivery.status === 'Delivered' && (
                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 dark:text-green-200">
                        Delivered Successfully
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {delivery.deliveryDate && `Date: ${new Date(delivery.deliveryDate).toLocaleDateString()}`}
                        {delivery.deliveryTime && ` at ${delivery.deliveryTime}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
