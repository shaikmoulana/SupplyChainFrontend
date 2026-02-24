import { useState } from 'react';
import { ShoppingCart, FileText, Plus, Trash2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { suppliers, supplierProducts, type SupplierProduct } from '../data/mockData';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';

interface CartItem {
  supplierProduct: SupplierProduct;
  quantity: number;
}

export function CreatePurchaseOrder() {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Filter products by selected supplier
  const filteredProducts = selectedSupplierId
    ? supplierProducts.filter(p => p.supplierId === selectedSupplierId)
    : [];

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);

  // Add item to cart
  const handleAddToCart = (product: SupplierProduct) => {
    const quantity = quantities[product.id] || 0;
    
    if (quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (quantity < product.moq) {
      alert(`Minimum order quantity for ${product.productName} is ${product.moq} units`);
      return;
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      item => item.supplierProduct.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
      setCart(newCart);
    } else {
      // Add new item
      setCart([...cart, { supplierProduct: product, quantity }]);
    }

    // Reset quantity input
    setQuantities({ ...quantities, [product.id]: 0 });
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.supplierProduct.id !== productId));
  };

  // Update cart item quantity
  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.supplierProduct.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCart(newCart);
  };

  // Calculate totals
  const totalItems = cart.length;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.supplierProduct.supplierCost * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const grandTotal = subtotal + tax;

  // Generate Purchase Order
  const handleGeneratePO = () => {
    if (cart.length === 0) {
      alert('Please add items to cart before generating purchase order');
      return;
    }

    // In a real app, this would send data to backend
    alert(
      `Purchase Order Generated!\n\n` +
      `Supplier: ${selectedSupplier?.name}\n` +
      `Total Items: ${totalItems}\n` +
      `Total Quantity: ${totalQuantity}\n` +
      `Grand Total: $${grandTotal.toFixed(2)}\n\n` +
      `Order details have been saved.`
    );
    
    // Reset form
    setCart([]);
    setSelectedSupplierId('');
    setQuantities({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Create Purchase Order
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Select a supplier and add products to create a new purchase order
        </p>
      </div>

      {/* Supplier Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Select Supplier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select
                value={selectedSupplierId}
                onValueChange={setSelectedSupplierId}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Choose a supplier..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSupplier && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Contact:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedSupplier.contact}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedSupplier.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Selection */}
      {selectedSupplierId && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Available Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{product.productName}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.category}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Supplier Cost:
                      </span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${product.supplierCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Min. Order Qty:
                      </span>
                      <Badge variant="secondary">{product.moq} units</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Lead Time:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {product.leadTime} days
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor={`qty-${product.id}`}>Quantity</Label>
                    <Input
                      id={`qty-${product.id}`}
                      type="number"
                      min={product.moq}
                      placeholder={`Min: ${product.moq}`}
                      value={quantities[product.id] || ''}
                      onChange={(e) =>
                        setQuantities({
                          ...quantities,
                          [product.id]: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Cart / Bill Preview */}
      {cart.length > 0 && (
        <Card className="sticky bottom-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cart Items */}
            <div className="max-h-64 overflow-y-auto space-y-3">
              {cart.map(item => (
                <div
                  key={item.supplierProduct.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.supplierProduct.productName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${item.supplierProduct.supplierCost.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={item.supplierProduct.moq}
                      className="w-20"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateCartQuantity(
                          item.supplierProduct.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <span className="font-semibold text-gray-900 dark:text-white w-24 text-right">
                      ${(item.supplierProduct.supplierCost * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFromCart(item.supplierProduct.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {totalItems} product{totalItems !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Quantity:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {totalQuantity} units
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax (10%):</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${tax.toFixed(2)}
                </span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Grand Total:
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Generate PO Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleGeneratePO}
            >
              <FileText className="w-5 h-5 mr-2" />
              Generate Purchase Order
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedSupplierId && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Select a supplier to view available products
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
