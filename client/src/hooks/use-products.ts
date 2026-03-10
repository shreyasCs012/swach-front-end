import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertProduct } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// =========================
// === PRODUCTS ===
// =========================

export function useProducts(params?: { search?: string }) {
  const queryKey = [api.products.list.path, JSON.stringify(params)];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const urlParams = new URLSearchParams();

      if (params?.search)
        urlParams.append("search", params.search);

      const url = `${api.products.list.path}?${urlParams.toString()}`;

      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) throw new Error("Failed to fetch products");

      return api.products.list.responses[200].parse(await res.json());
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.products.get.path, { id });

      const res = await fetch(url, { credentials: "include" });

      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch product");

      return api.products.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertProduct) => {
      const res = await fetch(api.products.create.path, {
        method: api.products.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create product");

      return api.products.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.products.list.path],
      });

      toast({
        title: "Product created",
        description: "Successfully added to catalog",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    },
  });
}

/* =========================
   ✅ DELETE PRODUCT (NEW)
========================= */

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.products.delete.path, { id });

      const res = await fetch(url, {
        method: api.products.delete.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      return api.products.delete.responses[200].parse(await res.json());
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.products.list.path],
      });

      toast({
        title: "Product deleted",
        description: "Product removed from catalog",
      });
    },

    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });
}
