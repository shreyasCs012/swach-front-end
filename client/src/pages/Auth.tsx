import { useState } from "react";
import { useLogin, useRegister, useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Package } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { api } from "@shared/routes";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { data: user, isLoading: isLoadingUser } = useUser();
  const [, setLocation] = useLocation();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  if (isLoadingUser) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (user) {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90" />
        {/* abstract bubbles cleaning background */}
        <img 
          src="https://pixabay.com/get/gbb1b840f768bed0ae53ff123e72741280ea6d7f8b86c218e9c11427eb1d4e33857ae4458e7e2b795987703217acb27e4e571bc60a865a70e081fcd5e41b11e19_1280.jpg" 
          alt="Background" 
          className="absolute inset-0 object-cover w-full h-full mix-blend-overlay opacity-20"
        />
        
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary">
              <Package size={28} />
            </div>
            <h1 className="text-4xl font-display font-bold">CleanKart</h1>
          </div>
          <h2 className="text-5xl font-bold mb-6">Premium cleaning products delivered to your door.</h2>
          <p className="text-lg opacity-90">Join thousands of happy customers who trust CleanKart for their home maintenance needs. Fast delivery, eco-friendly options, and satisfaction guaranteed.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-display font-bold mb-2">
              {isLogin ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {isLogin ? "Enter your credentials to access your account" : "Sign up to start shopping"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <LoginForm onToggle={() => setIsLogin(false)} mutation={loginMutation} />
            ) : (
              <RegisterForm onToggle={() => setIsLogin(true)} mutation={registerMutation} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LoginForm({ onToggle, mutation }: { onToggle: () => void, mutation: any }) {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" }
  });

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data));

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...form.register("username")} placeholder="Enter your username" className="h-11" />
        {form.formState.errors.username && <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...form.register("password")} placeholder="••••••••" className="h-11" />
        {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
      </div>
      
      <Button type="submit" className="w-full h-11 text-base" disabled={mutation.isPending}>
        {mutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Sign In"}
      </Button>

      <div className="text-center text-sm text-muted-foreground mt-4">
        Don't have an account?{" "}
        <button type="button" onClick={onToggle} className="text-primary font-semibold hover:underline">
          Sign up
        </button>
      </div>
    </form>
  );
}

function RegisterForm({ onToggle, mutation }: { onToggle: () => void, mutation: any }) {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", confirmPassword: "", name: "", address: "", phone: "" }
  });

  const onSubmit = form.handleSubmit((data) => {
    const { confirmPassword, ...submitData } = data;
    mutation.mutate(submitData);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reg-name">Full Name</Label>
          <Input id="reg-name" {...form.register("name")} placeholder="John Doe" />
          {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-username">Username</Label>
          <Input id="reg-username" {...form.register("username")} placeholder="johndoe" />
          {form.formState.errors.username && <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reg-address">Delivery Address</Label>
        <Input id="reg-address" {...form.register("address")} placeholder="123 Main St, City" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-phone">Phone Number</Label>
        <Input id="reg-phone" {...form.register("phone")} placeholder="+1 (555) 000-0000" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reg-password">Password</Label>
          <Input id="reg-password" type="password" {...form.register("password")} placeholder="••••••••" />
          {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input id="confirm" type="password" {...form.register("confirmPassword")} placeholder="••••••••" />
          {form.formState.errors.confirmPassword && <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full h-11 text-base mt-2" disabled={mutation.isPending}>
        {mutation.isPending ? <Loader2 className="animate-spin mr-2" /> : "Create Account"}
      </Button>

      <div className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <button type="button" onClick={onToggle} className="text-primary font-semibold hover:underline">
          Log in
        </button>
      </div>
    </form>
  );
}
