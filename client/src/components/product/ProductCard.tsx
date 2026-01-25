import { type Product, type Category } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product & { category?: Category };
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart(state => state.addItem);
  const { toast } = useToast();

  const handleAdd = () => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="aspect-square relative overflow-hidden bg-secondary/20">
        {/* Unsplash placeholder since we don't have real images yet */}
        {/* cleaning product bottle minimalist studio shot */}
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1585833446059-e93540c9462e?w=800&q=80"} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {product.stockQuantity < 5 && (
          <div className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-full">
            Low Stock
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-semibold text-lg leading-tight line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[40px]">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="font-bold text-lg text-primary">
            ${(product.price / 100).toFixed(2)}
          </div>
          
          <Button 
            onClick={handleAdd} 
            size="sm" 
            className="rounded-full w-8 h-8 p-0 md:w-auto md:px-4 md:h-9"
          >
            <Plus className="w-5 h-5 md:mr-1.5 md:w-4 md:h-4" />
            <span className="hidden md:inline">Add</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
