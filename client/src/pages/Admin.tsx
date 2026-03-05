import { useUser } from "@/hooks/use-auth";
import {
  useProducts,
  useCreateProduct,
  useDeleteProduct,
  useCategories,
} from "@/hooks/use-products";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, DollarSign, Package, ShoppingBag, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ZodType } from "zod";

export default function AdminDashboard() {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  if (isLoading) return <Loader2 className="animate-spin" />;

  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">
        Admin Dashboard
      </h1>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab() {
  const { data: orders } = useOrders();
  const { data: products } = useProducts();

  const totalRevenue =
    orders?.reduce((sum, o) => sum + o.totalAmount, 0) || 0;
  const totalOrders = orders?.length || 0;

  const data = [
    { name: "Mon", sales: 400 },
    { name: "Tue", sales: 300 },
    { name: "Wed", sales: 600 },
    { name: "Thu", sales: 200 },
    { name: "Fri", sales: 900 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalRevenue / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Products
            </CardTitle>
            <Package className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <CardTitle className="mb-6">Weekly Sales</CardTitle>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function ProductsTab() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(insertProductSchema as unknown as ZodType<any>),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      categoryId: 0,
      imageUrl: "",
      isActive: true,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    createProduct.mutate(data, {
      onSuccess: () => setOpen(false),
    });
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Product Catalog</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-4">
              <Input placeholder="Name" {...form.register("name")} />
              <Textarea
                placeholder="Description"
                {...form.register("description")}
              />
              <Input
                type="number"
                placeholder="Price (cents)"
                {...form.register("price", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="Stock"
                {...form.register("stockQuantity", {
                  valueAsNumber: true,
                })}
              />
              <Input
                placeholder="Image URL"
                {...form.register("imageUrl")}
              />

              <Select
                onValueChange={(val) =>
                  form.setValue("categoryId", Number(val))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button type="submit" className="w-full">
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.imageUrl}
                    className="w-10 h-10 rounded object-cover"
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  ${(product.price / 100).toFixed(2)}
                </TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (
                        confirm("Delete this product?")
                      ) {
                        deleteProduct.mutate(product.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function OrdersTab() {
  const { data: orders } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>#{order.id}</TableCell>
              <TableCell>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : ""}
              </TableCell>
              <TableCell>{order.userId}</TableCell>
              <TableCell>
                <Select
                  defaultValue={order.status}
                  onValueChange={(val: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') =>
                  updateStatus.mutate({
                    id: order.id,
                    status: val,
                  })
}
                >
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      Pending
                    </SelectItem>
                    <SelectItem value="processing">
                      Processing
                    </SelectItem>
                    <SelectItem value="shipped">
                      Shipped
                    </SelectItem>
                    <SelectItem value="delivered">
                      Delivered
                    </SelectItem>
                    <SelectItem value="cancelled">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                ${(order.totalAmount / 100).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}