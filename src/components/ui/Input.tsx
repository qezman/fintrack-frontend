import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftAddon, rightElement, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-(--text-secondary) ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3.5 flex items-center text-(--text-tertiary) pointer-events-none">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex h-11 w-full rounded bg-(--bg-input) border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-primary)] transition-all placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] disabled:cursor-not-allowed disabled:opacity-50",
              leftAddon && "pl-10",
              rightElement && "pr-10",
              error &&
                "border-(--expense) focus:border-(--expense) focus:ring-(--expense)",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs ml-1 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
