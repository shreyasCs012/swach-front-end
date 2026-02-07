import { useOrders } from "@/hooks/use-orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, Clock, CheckCircle, Truck, XCircle, Loader2 } from "lucide-react";
import {Header} from "@/components/layout/Header";

export default function Orders() {
  const { data: orders, isLoading } = useOrders();

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
      case 'delivered': return <CheckCircle size={16} className="mr-1" />;
      case 'shipped': return <Truck size={16} className="mr-1" />;
      case 'cancelled': return <XCircle size={16} className="mr-1" />;
      default: return <Clock size={16} className="mr-1" />;
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <Header/>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders?.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-lg font-medium">No orders yet</h3>
            <p className="text-muted-foreground">Your order history will appear here.</p>
          </div>
        ) : (
          orders?.map((order) => (
            <Card key={order.id} className="overflow-hidden border-border/50 hover:border-border transition-colors">
              <CardHeader className="bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between py-4">
                <div className="space-y-1">
                  <CardTitle className="text-base">Order #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <Badge variant="secondary" className={`${getStatusColor(order.status)} border-transparent`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-secondary/20 rounded-md overflow-hidden">
                          {/* Placeholder until we join proper product details in response */}
                          <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            Prod
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Product ID: {item.productId}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${((item.priceAtTime * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="pt-4 border-t flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                    <p className="font-bold text-lg">Total: ${(order.totalAmount / 100).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
    </div>
  );
}
