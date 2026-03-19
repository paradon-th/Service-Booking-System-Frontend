"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2Icon, MailIcon } from "lucide-react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/public/images/logo-denso/denso_logo_svg.svg";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

type FormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
      const [isPending, startTransition] = useTransition();
      const [error, setError] = useState<string | null>(null);
      const [successMessage, setSuccessMessage] = useState<string | null>(null);


        const form = useForm<FormValues>({
          resolver: zodResolver(formSchema),
          mode: "onChange",
          defaultValues: {
            email: ""
          }
        });
          const onSubmit = (data: FormValues) => {
    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = payload?.message ?? "Unable to process request";
        setError(message);
        toast.error(message);
        return;
      }

      const payload = await response.json().catch(() => ({}));
      const message = payload?.message ?? "Reset instructions sent";
      setSuccessMessage(message);
      toast.success(message);
    });
  };
  return (
    <Card className="absolute !bg-white w-full max-w-[435px] mx-4 md:mx-auto max-h-[90vh] p-6 flex flex-col">
        <CardHeader>
          <CardTitle className="flex text-2xl text-[#454545] font-normal">Welcome to
          <Image
            width={86}
            height={17}
            src={logo}
            alt="logo"
            className="ml-2"
          />
        </CardTitle>
        <CardTitle className="text-center text-2xl mt-7 text-[#454545] font-normal">Forgot Password?</CardTitle>
          <CardDescription className="text-center">
            Enter your email to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          autoComplete="email"
                          className="w-full"
                          placeholder="Enter your email addresss"
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              {successMessage ? <p className="text-sm text-primary">{successMessage}</p> : null}
              <Button type="submit" className="w-full mt-6" disabled={isPending || !form.formState.isValid}>
                {isPending ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Back to{" "}
            <Link href="/login" className="hover:underline text-primary">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
  );
}