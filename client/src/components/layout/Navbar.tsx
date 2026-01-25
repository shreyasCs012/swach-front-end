import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, Package, Menu, Home, Layers } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const cartCount = useCart(state => state.count());
  const [location] = useLocation();

  const isAuthPage = location.startsWith('/auth');
  if (isAuthPage) return null;

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-2xl text-primary flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Package size={20} />
            </div>
            CleanKart
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Shop</Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">Categories</Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-sm font-medium hover:text-primary transition-colors">Admin Dashboard</Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-secondary/50">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-accent text-white text-[10px] font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2 text-sm font-medium text-muted-foreground">
                    Signed in as {user.name}
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/orders">
                    <DropdownMenuItem className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" /> My Orders
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around z-50 safe-area-bottom pb-safe">
        <Link href="/" className={`flex flex-col items-center gap-1 ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/categories" className={`flex flex-col items-center gap-1 ${location === '/categories' ? 'text-primary' : 'text-muted-foreground'}`}>
          <Layers size={20} />
          <span className="text-[10px] font-medium">Categories</span>
        </Link>
        <Link href="/cart" className={`flex flex-col items-center gap-1 relative ${location === '/cart' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className="relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-accent text-white text-[9px] font-bold rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Cart</span>
        </Link>
        <Link href={user ? "/orders" : "/auth"} className={`flex flex-col items-center gap-1 ${location.startsWith('/orders') || location.startsWith('/auth') ? 'text-primary' : 'text-muted-foreground'}`}>
          <User size={20} />
          <span className="text-[10px] font-medium">{user ? 'Profile' : 'Sign In'}</span>
        </Link>
      </nav>
    </>
  );
}
