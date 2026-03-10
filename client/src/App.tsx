import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import AuthPage from "@/pages/Auth";
import Cart from "@/pages/Cart";
import Orders from "@/pages/Orders";
import OrderStatus from "@/pages/OrderStatus";
import AdminDashboard from "@/pages/Admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/cart" component={Cart} />
      <Route path="/orders" component={Orders} />
      <Route path="/order-status" component={OrderStatus} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="swach-theme-v2">
        <TooltipProvider>
          {/* Root layout */}
          <div className="min-h-full flex flex-col bg-background">

            {/* Page content */}
            <main className="flex-1 overflow-y-auto">
              <Router />
            </main>

            {/* Toasts */}
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
