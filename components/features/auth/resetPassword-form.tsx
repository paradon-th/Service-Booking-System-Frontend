"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import logo from "@/public/images/logo-denso/denso_logo_svg.svg";
import { PasswordInput } from "@/components/custom-component/passwordInput";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import successlogo from "@/public/images/icons/success.svg";
import { useRouter } from 'next/navigation';

const resetSchema = z
  .object({
    // email: z.string().email("Please enter a valid email address"),
    // secretKey: z.string().min(1, "Verification code is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type ResetValues = z.infer<typeof resetSchema>;
export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter()

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      // email: searchParams.get("email") ?? "",
      // secretKey: searchParams.get("secretKey") ?? "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  // test dialog submission
  const [issuccess, setIsSuccess] = useState(false);
  const onTestSubmit = (data: ResetValues) => {
    console.log("Test Submit:", data);
    setIsSuccess(true);
  }

  const onSubmit = (values: ResetValues) => {
    setError(null);
    setSuccess(null);

    const payload = {
      // email: values.email,
      // secretKey: values.secretKey,
      newPassword: values.newPassword
    };

    startTransition(async () => {
      const response = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data?.message ?? "Unable to update password";
        setError(message);
        return;
      }

      const data = await response.json().catch(() => ({}));
      const message = data?.message ?? "Password updated";
      setSuccess(message);
      window.location.href = "/login";
    });
  };
  return (
    <>
      <Card className="absolute !bg-white w-full max-w-[435px] mx-4 md:mx-auto max-h-[90vh] flex flex-col">
        <CardHeader>
          <CardTitle className="flex text-2xl text-[#454545] font-normal">Welcome to
            <Image
              width={86}
              height={17}
              src={logo}
              alt="logo"
              className="ml-2"
              unoptimized
            />
          </CardTitle>
          <CardDescription className="text-lg text-[#454545] font-normal text-center mt-6">
            Reset Password
            <p className="text-sm text-gray-500">please set your new password.</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onTestSubmit)}>
              {/* <FormField
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
              /> */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Label htmlFor="newPassword">New password</Label>
                    <FormControl>
                      <PasswordInput id="newPassword" type="password" autoComplete="new-password" {...field} placeholder="Create password (min. 8 characters)" />
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
                      <Input id="confirmPassword" type="password" autoComplete="new-password" {...field} placeholder="Confirm Password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              {success ? <p className="text-sm text-primary">{success}</p> : null}
              <Button type="submit" className="w-full mt-6" disabled={isPending}>
                {isPending ? "Updating..." : "Reset Password"}
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
                        <h2 className="text-xl font-semibold mb-2">Password Reset</h2>
                        </div>
                      </DialogTitle>
                      <DialogDescription className="text-center mb-6">
                        Your password has been successfully reset. <br />
                        You can now sign in with your new password.
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
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">

        </CardFooter>
      </Card>
    </>
  );
}