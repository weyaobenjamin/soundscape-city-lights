import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Login = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const query = useQuery();
  const role = query.get("role") || "user";

  const ADMIN_EMAIL = "jones@gmail.com";
  const ADMIN_PASSWORD = "benjii";

  const onSubmit = async (data: { email: string; password: string }) => {
    setError("");
    if (role === "admin") {
      // Only allow hardcoded admin credentials
      if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
        navigate("/dashboard");
      } else {
        setError("Invalid admin credentials.");
      }
      return;
    }
    // For all other roles, use Firebase
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Login failed");
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
        <p className="text-center text-gray-500 mb-6">Enter your credentials to continue.</p>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Signup is disabled. Please use the admin credentials to login.
        </div>
      </div>
    </div>
  );
};

export default Login; 