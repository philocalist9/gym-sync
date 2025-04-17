import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          
          // Variants
          variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
          variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
          variant === "outline" && "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
          variant === "secondary" && "bg-green-600 text-white hover:bg-green-700",
          variant === "ghost" && "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
          variant === "link" && "bg-transparent underline-offset-4 hover:underline text-blue-600",
          
          // Sizes
          size === "default" && "h-10 py-2 px-4",
          size === "sm" && "h-9 px-3",
          size === "lg" && "h-11 px-8",
          size === "icon" && "h-10 w-10",
          
          className
        )}
        ref={asChild ? undefined : ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button } 