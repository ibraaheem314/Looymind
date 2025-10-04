import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"
    // Remove asChild from props to prevent it from being passed to DOM
    const { asChild: _, ...restProps } = props as any
    
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
    
    const variantClasses = {
      default: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5 focus-visible:ring-cyan-500",
      destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5 focus-visible:ring-red-500",
      outline: "border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-slate-500",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-slate-500",
      ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-500",
      link: "text-cyan-600 underline-offset-4 hover:underline hover:text-cyan-700 focus-visible:ring-cyan-500",
    }
    
    const sizeClasses = {
      default: "h-11 px-6 py-2.5 text-sm",
      sm: "h-9 rounded-lg px-4 text-xs",
      lg: "h-14 rounded-xl px-10 text-base",
      icon: "h-11 w-11",
    }
    
    return (
      <Comp
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...restProps}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }