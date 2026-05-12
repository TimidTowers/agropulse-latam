import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[110px] w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:border-brand",
          "disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
