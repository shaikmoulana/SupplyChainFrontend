import { useState } from 'react';
import { Ship, Truck, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface Shipment {
  id: string;
  orderNumber: string;
  customer: string;
  trackingId: string;
  carrier: string;
  status: 'Preparing' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
}

export function Shipping() {
  const [shipments] = useState<Shipment[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'ABC Corporation',
      trackingId: 'TRK-20240226-001',
      carrier: 'Express Logistics',
      status: 'In Transit',
      estimatedDelivery: '2024-02-28',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'XYZ Enterprises',
      trackingId: '',
      carrier: '',
      status: 'Preparing',
      estimatedDelivery: '2024-03-01',
    },
  ]);

  const handleAssignShipment = (shipmentId: string) => {
    console.log(`Assign shipment ${shipmentId}`);
  };

  const getStatusColor = (status: Shipment['status']) => {
    const colors = {
      Preparing: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'Out for Delivery': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Shipping Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Track and manage shipments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Preparing</p>
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {shipments.filter(s => s.status === 'Preparing').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">In Transit</p>
              <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {shipments.filter(s => s.status === 'In Transit').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Out for Delivery</p>
              <Ship className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {shipments.filter(s => s.status === 'Out for Delivery').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {shipments.filter(s => s.status === 'Delivered').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Shipments */}
      <div className="space-y-4">
        {shipments.map((shipment) => (
          <Card key={shipment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{shipment.orderNumber}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{shipment.customer}</p>
                </div>
                <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {shipment.status === 'Preparing' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tracking ID</Label>
                      <Input placeholder="Enter tracking number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Carrier</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="express">Express Logistics</SelectItem>
                          <SelectItem value="fast">Fast Delivery Co.</SelectItem>
                          <SelectItem value="reliable">Reliable Shipping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Delivery Date</Label>
                    <Input type="date" defaultValue={shipment.estimatedDelivery} />
                  </div>
                  <Button className="w-full" onClick={() => handleAssignShipment(shipment.id)}>
                    Assign Shipment
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tracking ID</p>
                    <p className="font-medium text-gray-900 dark:text-white">{shipment.trackingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Carrier</p>
                    <p className="font-medium text-gray-900 dark:text-white">{shipment.carrier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full">
                      Track Shipment
                    </Button>
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
