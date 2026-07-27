import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

const baseClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-55";

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-700 text-white shadow-[0_8px_20px_rgba(22,111,175,0.24)] hover:bg-brand-800",
  secondary:
    "border border-brand-300 bg-white text-brand-800 hover:border-brand-500 hover:bg-brand-50",
  quiet: "text-brand-700 hover:bg-brand-50",
  danger:
    "border border-coral-300 bg-coral-50 text-coral-800 hover:bg-coral-100",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  className = "",
): string {
  return `${baseClassName} ${variantClassNames[variant]} ${className}`.trim();
}

interface ButtonProps extends ComponentProps<"button"> {
  readonly variant?: ButtonVariant;
}

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClassName(variant, className)}
      type={type}
      {...props}
    />
  );
}

interface LinkButtonProps extends ComponentProps<typeof Link> {
  readonly variant?: ButtonVariant;
}

export function LinkButton({
  className = "",
  variant = "primary",
  ...props
}: LinkButtonProps) {
  return <Link className={buttonClassName(variant, className)} {...props} />;
}
