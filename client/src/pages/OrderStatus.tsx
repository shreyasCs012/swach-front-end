import { useOrders } from "@/hooks/use-orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Clock, CheckCircle, Truck, XCircle, Loader2, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import {Header} from "@/components/layout/Header";

export default function OrderStatus() {
  const { data: orders, isLoading } = useOrders();
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'shipped': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'delivered': return <CheckCircle size={20} className="mr-2" />;
      case 'shipped': return <Truck size={20} className="mr-2" />;
      case 'cancelled': return <XCircle size={20} className="mr-2" />;
      default: return <Clock size={20} className="mr-2" />;
    }
  };

  const getStatusSteps = (status: string) => {
    const steps = [
      { name: 'Order Placed', completed: true, current: status === 'pending' },
      { name: 'Processing', completed: ['processing', 'shipped', 'delivered'].includes(status), current: status === 'processing' },
      { name: 'Shipped', completed: ['shipped', 'delivered'].includes(status), current: status === 'shipped' },
      { name: 'Delivered', completed: status === 'delivered', current: status === 'delivered' },
    ];
    return steps;
  };

  const handleSearch = () => {
    const order = orders?.find(o => o.id.toString() === searchOrderId);
    setSearchedOrder(order || null);
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <Header/>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold mb-4">Order Status</h1>
        <p className="text-muted-foreground">Track your order status and delivery updates</p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search size={20} />
            Track Your Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter Order ID"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="px-6">
              Track Order
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Searched Order Status */}
      {searchedOrder && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package size={20} />
                Order #{searchedOrder.id}
              </CardTitle>
              <Badge variant="secondary" className={`${getStatusColor(searchedOrder.status)} border-transparent`}>
                {getStatusIcon(searchedOrder.status)}
                {searchedOrder.status.charAt(0).toUpperCase() + searchedOrder.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Order Date</p>
                  <p>{searchedOrder.createdAt ? new Date(searchedOrder.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Items</p>
                  <p>{searchedOrder.items?.length || 0} items</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Order ID</p>
                  <p>#{searchedOrder.id}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold">Order Timeline</h3>
                <div className="space-y-4">
                  {getStatusSteps(searchedOrder.status).map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-primary text-primary-foreground'
                          : step.current
                            ? 'bg-primary/20 text-primary border-2 border-primary'
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? <CheckCircle size={16} /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.current ? 'text-primary' : step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.name}
                        </p>
                        {step.current && (
                          <p className="text-sm text-muted-foreground">
                            {step.name === 'Delivered' ? 'Your order has been delivered successfully!' :
                             step.name === 'Shipped' ? 'Your order is on the way!' :
                             step.name === 'Processing' ? 'We\'re preparing your order.' :
                             'Order confirmed and received.'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        {orders?.slice(0, 5).map((order) => (
          <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
            setSearchOrderId(order.id.toString());
            setSearchedOrder(order);
          }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={`${getStatusColor(order.status)} border-transparent text-xs`}>
                    {order.status}
                  </Badge>
                  <ArrowRight size={16} className="text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </div>
  );
}