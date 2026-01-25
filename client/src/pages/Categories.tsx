import { useCategories, useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product/ProductCard";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Categories() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const activeCategoryId = params.get('id') ? Number(params.get('id')) : undefined;
  
  const { data: categories, isLoading: isCatsLoading } = useCategories();
  const { data: products, isLoading: isProdsLoading } = useProducts({ 
    categoryId: activeCategoryId 
  });

  if (isCatsLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      <h1 className="text-3xl font-display font-bold mb-8">Browse Categories</h1>
      
      {/* Category Pills */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
        <button
          onClick={() => window.history.pushState(null, '', '/categories')}
          className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            !activeCategoryId 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          All Products
        </button>
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => window.history.pushState(null, '', `/categories?id=${category.id}`)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategoryId === category.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isProdsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      {products?.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No products found in this category.
        </div>
      )}
    </div>
  );
}
