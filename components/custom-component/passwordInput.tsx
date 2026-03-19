"use client"

import * as React from "react"
import EyeOff from "@/public/images/icons/Eye.svg";
import Eye from "@/public/images/icons/EyeOff.svg";
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import Image from "next/image";

const PasswordInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
              )}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 trans hover:bg-transparent"
        onClick={handleTogglePasswordVisibility}
      >
        {showPassword ? (
          <Image
          src={EyeOff}
          alt="eye off icon"
          className="w-6 h-6"
        />
        ) : (
          <Image
          src={Eye}
          alt="eye icon"
          className="w-6 h-6"
        />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  )
}

export { PasswordInput }