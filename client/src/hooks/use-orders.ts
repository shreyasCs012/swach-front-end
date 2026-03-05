import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "../lib/auth-fetch";

/* ==============================
        GET ALL ORDERS
============================== */

export function useOrders() {
  return useQuery({
    queryKey: [api.orders.list.path],
    queryFn: async () => {
      const res = await authFetch(api.orders.list.path);

      if (!res.ok) throw new Error("Failed to fetch orders");

      return api.orders.list.responses[200].parse(await res.json());
    },
  });
}

/* ==============================
        GET HISTORY (Delivered)
============================== */

export function useHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: async () => {
      const res = await authFetch(api.history.list.path);

      if (!res.ok) throw new Error("Failed to fetch history");

      return api.history.list.responses[200].parse(await res.json());
    },
  });
}

/* ==============================
        GET SINGLE ORDER
============================== */

export function useOrder(id: number) {
  return useQuery({
    queryKey: [api.orders.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.orders.get.path, { id });

      const res = await authFetch(url);

      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch order");

      return api.orders.get.responses[200].parse(await res.json());
    },
  });
}

/* ==============================
        CREATE ORDER
============================== */

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      deliveryAddress: string;
      items: { productId: number; quantity: number }[];
    }) => {
      const res = await authFetch(api.orders.create.path, {
        method: api.orders.create.method,
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create order");

      return api.orders.create.responses[201].parse(await res.json());
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.orders.list.path],
      });

      toast({
        title: "Order placed!",
        description: "We'll start processing it right away.",
      });
    },

    onError: () => {
      toast({
        title: "Order failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
}

/* ==============================
        UPDATE ORDER STATUS
============================== */

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled";
    }) => {
      const url = buildUrl(api.orders.updateStatus.path, { id });

      const res = await authFetch(url, {
        method: api.orders.updateStatus.method,
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      return api.orders.updateStatus.responses[200].parse(
        await res.json()
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [api.orders.list.path],
      });

      toast({
        title: "Status updated",
        description: "Order status has been changed.",
      });
    },
  });
}