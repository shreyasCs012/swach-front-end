import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { InsertUser } from "@shared/schema"; // Add the correct import path if different

const JWT_STORAGE_KEY = "auth_token";

export function useUser() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const token = localStorage.getItem(JWT_STORAGE_KEY);
      const res = await fetch(api.auth.me.path, { 
        credentials: "include",
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.me.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (credentials: z.infer<typeof api.auth.login.input>) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid username or password");
        throw new Error("Login failed");
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Store JWT in localStorage
      if ((data as any).token) {
        localStorage.setItem(JWT_STORAGE_KEY, (data as any).token);
        console.log("JWT stored in localStorage");
      }
      queryClient.setQueryData([api.auth.me.path], data);
      toast({ title: "Welcome back!", description: `Logged in as ${(data as any).name ?? (data as any).user?.name}` });
      const role = (data as any).user?.role ?? (data as any).role;
      setLocation(role === 'admin' ? '/admin' : '/');
    },
    onError: (error) => {
      toast({ 
        title: "Login failed", 
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive"
      });
    }
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.auth.register.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Registration failed");
      }
      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Store JWT in localStorage
      if ((data as any).token) {
        localStorage.setItem(JWT_STORAGE_KEY, (data as any).token);
        console.log("JWT stored in localStorage");
      }
      queryClient.setQueryData([api.auth.me.path], data);
      toast({ title: "Account created!", description: "Welcome to CleanKart" });
      setLocation('/');
    },
    onError: (error) => {
      toast({ 
        title: "Registration failed", 
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      });
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.logout.path, { 
        method: api.auth.logout.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      // Clear JWT from localStorage
      localStorage.removeItem(JWT_STORAGE_KEY);
      console.log("JWT removed from localStorage");
      queryClient.setQueryData([api.auth.me.path], null);
      toast({ title: "Logged out", description: "See you soon!" });
      setLocation('/auth');
    }
  });
}