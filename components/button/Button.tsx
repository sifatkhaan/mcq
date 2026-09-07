"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "ghost"
  | "outline";

type ButtonSize = "sm" | "md" | "lg";
interface BaseButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  className?: string;
}

interface ButtonProps
  extends
    BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  href?: never;
}

interface ButtonLinkProps extends BaseButtonProps {
  href: string;
  target?: string;
  rel?: string;
}

export type AppButtonProps = ButtonProps | ButtonLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-300",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-300",
  success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-300",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-xs rounded-md",
  md: "min-h-11 px-4 text-sm rounded-lg",
  lg: "min-h-12 px-6 text-base rounded-lg",
};

export default function Button(props: AppButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    loadingText,
    fullWidth = false,
    className = "",
    ...rest
  } = props;

  const classes = [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "font-medium",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-1",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = loading ? (
    <>
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden="true"
      />

      <span>{loadingText ?? "Loading..."}</span>
    </>
  ) : (
    children
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = props;

    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      disabled={
        loading || (rest as ButtonHTMLAttributes<HTMLButtonElement>).disabled
      }
      className={classes}
    >
      {content}
    </button>
  );
}
