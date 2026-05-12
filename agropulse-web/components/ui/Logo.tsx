import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  withText?: boolean;
  textClassName?: string;
}

export function Logo({
  className,
  withText = true,
  textClassName,
  ...props
}: LogoProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className={cn("h-8 w-8", className)}
        aria-hidden="true"
        {...props}
      >
        <defs>
          <linearGradient
            id="agroPulseGrad"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#15803D" />
            <stop offset="0.55" stopColor="#22C55E" />
            <stop offset="1" stopColor="#84CC16" />
          </linearGradient>
        </defs>
        <rect
          width="40"
          height="40"
          rx="11"
          fill="url(#agroPulseGrad)"
        />
        <path
          d="M9 25 L14 25 L17 19 L22 30 L25 22 L31 22"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="31" cy="22" r="2.4" fill="white" />
      </svg>
      {withText && (
        <span
          className={cn(
            "font-semibold tracking-tight text-ink text-lg",
            textClassName,
          )}
        >
          AgroPulse
        </span>
      )}
    </span>
  );
}
