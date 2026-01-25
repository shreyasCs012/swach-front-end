import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { data: user } = useUser();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [address, setAddress] = useState(user?.address || "");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const subtotal = total();
  const shipping = 500; // $5.00
  const orderTotal = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      toast({ title: "Please login", description: "You need to be logged in to checkout", variant: "destructive" });
      setLocation('/auth');
      return;
    }
    
    if (!address) {
      toast({ title: "Address required", description: "Please enter a delivery address", variant: "destructive" });
      return;
    }

    createOrder({
      deliveryAddress: address,
      items: items.map(item => ({ productId: item.id, quantity: item.quantity }))
    }, {
      onSuccess: () => {
        clearCart();
        setLocation('/orders');
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
          <Trash2 size={40} />
        </div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Link href="/">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
      </Link>

      <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-card rounded-xl border border-border shadow-sm">
              <div className="w-24 h-24 bg-secondary/20 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${(item.price / 100).toFixed(2)}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-muted"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-muted"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="ml-auto font-bold">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-lg h-fit space-y-6">
          <h3 className="font-bold text-xl">Order Summary</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>${(shipping / 100).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(orderTotal / 100).toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Delivery Address</label>
            <Input 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address" 
            />
          </div>

          <Button 
            className="w-full h-12 text-base shadow-lg shadow-primary/20" 
            onClick={handleCheckout}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin mr-2" /> : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
