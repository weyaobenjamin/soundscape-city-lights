import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";

const ADMIN_EMAIL = "jones@gmail.com";

const Signup = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit = async (data: { name: string; email: string; password: string; role: string }) => {
    setError("");
    // Prevent admin signup
    if (data.email === ADMIN_EMAIL) {
      setError("Admin account cannot be created via signup.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      if (data.name) {
        await updateProfile(userCredential.user, { displayName: data.name });
      }
      // Store role in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: data.name,
        email: data.email,
        role: data.role,
      });
      navigate("/user-dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Signup failed");
      } else {
        setError("Signup failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-gray-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-emerald-400">
        <h2 className="text-2xl font-bold mb-6 text-emerald-400 drop-shadow">Sign Up</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input type="password" placeholder="Create a password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm text-gray-200">
          Already have an account? <Link to="/login" className="text-emerald-400 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup; 