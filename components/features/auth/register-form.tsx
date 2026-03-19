"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/public/images/logo-denso/denso_logo_svg.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { PasswordInput } from "@/components/custom-component/passwordInput";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation'
import successlogo from "@/public/images/icons/success.svg";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter()

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // test dialog submission
  const [issuccess, setIsSuccess] = useState(false);
  const onTestSubmit = (data: RegisterValues) => {
    console.log("Test Submit:", data);
    setIsSuccess(true);
    toast.success("Test submit successful!");
  }

  const onSubmit = (values: RegisterValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include"
      });

      const payload = await response.json().catch(() => ({}));
      const message = payload?.message ?? "Registration submitted";

      if (!response.ok) {
        setError(message);
        toast.error(message);
        return;
      }
      setIsSuccess(true);
      setSuccess(message);
      toast.success(message);
    });
  };

  return (
    <Card className="absolute !bg-white w-full max-w-[700px] mx-4 p-6 md:mx-auto max-h-[90vh] flex flex-col">
      <CardHeader>
        <CardTitle className="flex text-2xl text-[#454545] font-normal">Welcome to
          <Image
            width={86}
            height={17}
            src={logo}
            alt="logo"
            className="ml-2"
            unoptimized
          /></CardTitle>
        <CardDescription className="text-3xl text-[#454545] font-normal">
          Sign up
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="firstName">First name</Label>
                    <FormControl>
                      <Input id="firstName" {...field} placeholder="Enter first name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="lastName">Last name</Label>
                    <FormControl>
                      <Input id="lastName" {...field} placeholder="Enter last name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input id="email" type="email" autoComplete="email" {...field} placeholder="Enter your email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <PasswordInput id="password" autoComplete="new-password" {...field} placeholder="Create password (min. 8 characters)" />
                    </FormControl>
                    {fieldState.error ? (
                      <FormMessage />
                    ) : (<FormDescription className="text-[12px]">
                      Use 8 or more characters with letters and numbers.
                    </FormDescription>)}

                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <FormControl>
                      <PasswordInput id="confirmPassword" autoComplete="new-password" {...field} placeholder="Confirm your password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {success ? <p className="text-sm text-primary">{success}</p> : null}
            <Button type="submit" className="w-full mt-6" disabled={isPending || !form.formState.isValid}>
              {isPending ? "Submitting..." : "Sign up"}
            </Button>
            <Dialog open={issuccess} onOpenChange={setIsSuccess}>
              <DialogContent className="w-[500px]">
                <div className="p-4 text-center">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      <div>
                        <Image
                          src={successlogo}
                          alt="success icon"
                          className="mx-auto mb-4"
                          unoptimized
                        />
                        <h2 className="text-xl font-semibold mb-2">Account created</h2>
                      </div>
                    </DialogTitle>
                    <DialogDescription className="text-center mb-6">
                      Welcome user! Your account has been created successfully. <br />
                      You can now sign in.
                    </DialogDescription>
                  </DialogHeader>

                  <Button className="text-center w-52" onClick={() => {
                    setIsSuccess(false);
                    router.push('/login');
                  }}
                  >Go to Sign in</Button>
                </div>
              </DialogContent>
            </Dialog>
            {/* <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Submitting..." : "Sign up"}
            </Button> */}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        <p className="text-sm text-gray-500">
          Already have an account? {" "}
          <Link href="/login" className="hover:underline text-primary">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
