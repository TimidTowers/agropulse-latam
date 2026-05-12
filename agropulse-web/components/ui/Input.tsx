import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border-soft bg-surface px-4 py-2 text-sm text-ink placeholder:text-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:border-brand",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
