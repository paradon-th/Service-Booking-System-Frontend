"use client";

import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import logo from "@/public/images/logo-denso/denso_logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { use, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/custom-component/passwordInput";
import { Separator } from "@/components/ui/separator";
import { useSamlLogin } from "@/hooks/use-saml-login";
import logoMicrosoft from "@/public/images/logo/logo-microsoft.png";
import { Spinner } from "@/components/ui/spinner";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional()
});

type LoginValues = z.infer<typeof loginSchema>;

const REMEMBER_EMAIL_KEY = "icube_remember_email";

export function LoginForm() {

  const [isPending, startTransition] = useTransition();
  const [usingEmail, setUsingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { SAML2Login, isSAML2Authloading } = useSamlLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  });

  useEffect(() => {
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const createCookie = (name: string, value: string, days: number) => {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
    }

    const eraseCookie = (name: string) => {
      createCookie(name, "", -1);
      document.cookie = name + '=; Max-Age=0; path=/; domain=' + window.location.host;
    }

    const accessToken = getCookie("access_token");
    const refreshToken = getCookie("refresh_token");

    if (accessToken && refreshToken) {
      const loginWithToken = async () => {
        const response = await fetch("/api/auth/token-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken, refreshToken }),
        });

        if (response.ok) {
          eraseCookie("access_token");
          eraseCookie("refresh_token");
          window.location.href = "/overview";
        } else {
          toast.error("Failed to sign in with SAML token.");
        }
      };

      loginWithToken();
    }
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (stored) {
      form.setValue("email", stored);
      form.setValue("remember", true);
    }
  }, [form]);

  const onSubmit = (values: LoginValues) => {
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data?.message ?? "Unable to sign in");
        toast.error(data?.message ?? "Unable to sign in");
        return;
      }

      if (values.remember) {
        window.localStorage.setItem(REMEMBER_EMAIL_KEY, values.email);
      } else {
        window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      window.location.href = "/overview";
    });
  };

  const [version, setVersion] = useState("1.0.0");

  useEffect(() => {
    const version = process.env.NEXT_PUBLIC_VERSION || "1.0.0";
    setVersion(version);
  }, [version]);

  return (
    <Card className="!bg-white z-50 w-full max-w-[535px] mx-4 md:mx-auto max-h-[95vh] overflow-y-auto p-4 md:p-6 flex flex-col shadow-lg">
      <CardHeader className="text-center pb-2 md:pb-6">
        <CardTitle className="flex text-base md:text-lg items-center mt-2 md:mt-6 justify-center text-[#454545] font-normal">
          Welcome to
          <Image
            width={86}
            height={17}
            src={logo}
            alt="logo"
            unoptimized={false}
            className="ml-2 w-[70px] md:w-[86px]" // ปรับขนาดโลโก้ตามจอ
          />
        </CardTitle>
        <CardDescription className="text-2xl md:text-3xl font-bold text-[#454545] mt-2">
          Sign in
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 md:px-6">
        <Button
          type="button"
          className="w-full h-12 md:h-13 rounded-xl mt-2 md:mt-4"
          disabled={isSAML2Authloading}
          onClick={() => SAML2Login('microsoft')}
        >
          <div className="flex gap-2 text-base md:text-lg items-center justify-center">
            <Image
              width={20}
              height={20}
              src={logoMicrosoft}
              alt="logoMicrosoft"
            />
            <span>Sign in with Microsoft</span>
          </div>
        </Button>

        <p className="text-[#8D8D8D] text-xs md:text-sm mt-4 text-center">
          Use your company Microsoft account.
        </p>

        {usingEmail ? (
          <div className="mb-4 md:mb-6 mt-4 md:mt-6 text-center">
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          className="h-12 md:h-13 rounded-xl text-base"
                          autoComplete="email"
                          placeholder="Enter your Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <Label htmlFor="password">Password</Label>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          className="h-12 md:h-13 rounded-xl text-base"
                          autoComplete="current-password"
                          placeholder="Enter your Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* {error ? <p className="text-sm text-destructive text-center">{error}</p> : null} */}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={(checked: any) => field.onChange(checked === true)}
                          />
                        </FormControl>
                        <Label className="text-sm text-gray-500 cursor-pointer font-normal">Remember me</Label>
                      </FormItem>
                    )}
                  />
                  <Link href="/forgot-password" className="text-sm hover:underline">
                    Forgot password
                  </Link>
                </div>

                <Button
                  variant="outline"
                  type="submit"
                  className="w-full mt-5 h-12 md:h-13 rounded-xl border border-gray-400 text-base md:text-lg"
                  disabled={isPending || !form.formState.isValid}>
                  {isPending ? (
                    <>
                      <Spinner className="size-6" />
                      <span className="ml-2">Signing in...</span>
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>

              </form>
            </Form>
          </div>
        ) : (
          <div className="mb-4 mt-4 text-center">
            <Button
              variant="link"
              className="text-[#6B6B6B] mt-4 md:mt-8 text-sm md:text-[16px]"
              onClick={() => setUsingEmail(true)}
            >
              Sign in using email
            </Button>
          </div>
        )}

      </CardContent>
      <CardFooter>
        <div className="w-full text-xs md:text-sm text-[#8D8D8D]">
          <div className="w-full text-center leading-relaxed">
            <div>By clicking "Sign in" you agree to PC Reforming</div>
            <p>
              <Link href="/terms-of-service" className="text-[#76B9EF] cursor-pointer hover:underline">Terms Of Service </Link>
              {/* <span className="text-[#76B9EF] cursor-pointer hover:underline">Terms Of Service </span> */}
              and
              <Link href="/privacy-policy" className="text-[#76B9EF] cursor-pointer hover:underline"> Privacy Policy</Link>
              {/* <span className="text-[#76B9EF] cursor-pointer hover:underline"> Privacy Policy</span> */}
            </p>
          </div>
          {/* Responsive Footer Layout: แนวตั้งบนมือถือ แนวนอนบนจอใหญ่ */}
          <div className="w-full flex flex-col-reverse md:flex-row items-center md:justify-between mt-6 md:mt-10 gap-2">
            <div>
              Powered by <span className="text-[#76B9EF] font-semibold">DNTH</span>
            </div>
            <p>Version {version}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}