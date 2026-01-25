import { useProducts, useCategories } from "@/hooks/use-products";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useProducts({ search });
  const { data: categories } = useCategories();

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 rounded-b-3xl md:rounded-3xl mt-0 md:mt-4 mx-0 md:mx-4">
        <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm">
              <Sparkles size={16} />
              <span>Premium Cleaning Supplies</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight">
              Make your home <span className="text-primary">shine</span> brighter.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
              Professional grade cleaning products delivered straight to your doorstep. Experience the difference today.
            </p>
            
            <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-9 h-12 bg-white/80 backdrop-blur border-transparent shadow-sm focus:border-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-12 px-6 shadow-lg shadow-primary/25">
                Shop Now
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative h-64 md:h-96 w-full">
            {/* cleaning products composition studio shot */}
            <img 
              src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80" 
              alt="Cleaning Products" 
              className="object-contain w-full h-full drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Shop by Category</h2>
          <Link href="/categories" className="text-primary font-medium flex items-center hover:underline">
            View All <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories?.slice(0, 4).map((category) => (
            <Link key={category.id} href={`/categories?id=${category.id}`}>
              <div className="group cursor-pointer rounded-2xl overflow-hidden relative aspect-[4/3]">
                <img 
                  src={category.imageUrl} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <h3 className="text-white font-bold text-xl">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-display font-bold mb-6">Featured Products</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
