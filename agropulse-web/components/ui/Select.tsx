import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full appearance-none rounded-xl border border-border-soft bg-surface bg-no-repeat bg-right pl-4 pr-10 py-2 text-sm text-ink",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:border-brand",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-colors cursor-pointer",
          className,
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2364748b' d='M6 7.4L0.6 2 2 .6 6 4.6 10 .6 11.4 2z'/%3E%3C/svg%3E\")",
          backgroundPosition: "right 1rem center",
        }}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";
