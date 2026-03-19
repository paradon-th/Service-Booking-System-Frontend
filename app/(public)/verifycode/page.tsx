"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateMeta } from "@/lib/utils";

const verifySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  secretKey: z.string().min(1, "Verification code is required")
});

type VerifyValues = z.infer<typeof verifySchema>;

// export function generateMetadata() {
//   return generateMeta({
//     title: "Verify Reset Code",
//     description: "Enter the verification code sent to your email.",
//     canonical: "/verifycode"
//   });
// }

export default function Page() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      secretKey: ""
    }
  });

  const onSubmit = (values: VerifyValues) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = payload?.message ?? "Verification failed";
        setError(message);
        return;
      }

      const payload = await response.json().catch(() => ({}));
      const message = payload?.message ?? "Verification successful";
      setSuccess(message);
      window.location.href = `/newpassword?email=${encodeURIComponent(values.email)}&secretKey=${encodeURIComponent(
        values.secretKey
      )}`;
    });
  };

  return (
    <div className="flex items-center justify-center py-4 lg:h-screen">
      <Card className="mx-auto w-96">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Code</CardTitle>
          <CardDescription>Enter the verification code you received via email.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input id="email" type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secretKey"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="secretKey">Verification code</Label>
                    <FormControl>
                      <Input id="secretKey" placeholder="Enter your code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              {success ? <p className="text-sm text-primary">{success}</p> : null}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <a href="/forgot-password" className="underline">
            Resend email
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
