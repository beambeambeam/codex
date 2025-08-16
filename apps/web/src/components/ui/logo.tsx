"use client";

import { ComponentProps, forwardRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

interface LogoProps extends Omit<ComponentProps<typeof Image>, "src" | "alt"> {
  className?: string;
  size?: number;
  alt?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-hidden"?: boolean;
  role?: string;
  title?: string;
}

export const Icon = forwardRef<HTMLImageElement, LogoProps>(
  (
    {
      className,
      size = 32,
      alt = "The Codex Icon",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      "aria-hidden": ariaHidden = false,
      role = "img",
      title,
      ...props
    },
    ref,
  ) => {
    return (
      <Image
        ref={ref}
        src="/static/logo/icon.svg"
        alt={alt}
        width={size}
        height={size}
        className={cn("shrink-0 select-none", className)}
        aria-label={ariaLabel || alt}
        aria-describedby={ariaDescribedby}
        aria-hidden={ariaHidden}
        role={role}
        title={title || alt}
        draggable={false}
        {...props}
      />
    );
  },
);

Icon.displayName = "Icon";

// Logo component - switches between light and dark versions based on theme
export const Logo = forwardRef<HTMLImageElement, LogoProps>(
  (
    {
      className,
      size = 120,
      alt = "The Codex Logo",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      "aria-hidden": ariaHidden = false,
      role = "img",
      title,
      ...props
    },
    ref,
  ) => {
    const { resolvedTheme } = useTheme();

    // Determine which logo to show based on resolved theme
    const logoSrc =
      resolvedTheme === "dark"
        ? "/static/logo/logo-white.svg"
        : "/static/logo/logo-dark.svg";

    const themeAwareAlt = `${alt} (${resolvedTheme || "system"} theme)`;

    return (
      <Image
        ref={ref}
        src={logoSrc}
        alt={alt}
        width={size}
        height={size}
        className={cn("shrink-0 select-none", className)}
        aria-label={ariaLabel || themeAwareAlt}
        aria-describedby={ariaDescribedby}
        aria-hidden={ariaHidden}
        role={role}
        title={title || themeAwareAlt}
        draggable={false}
        {...props}
      />
    );
  },
);

Logo.displayName = "Logo";

export const LogoDark = forwardRef<HTMLImageElement, LogoProps>(
  (
    {
      className,
      size = 120,
      alt = "The Codex Logo",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      "aria-hidden": ariaHidden = false,
      role = "img",
      title,
      ...props
    },
    ref,
  ) => {
    const darkAlt = `${alt} (dark version)`;

    return (
      <Image
        ref={ref}
        src="/static/logo/logo-dark.svg"
        alt={alt}
        width={size}
        height={size}
        className={cn("shrink-0 select-none", className)}
        aria-label={ariaLabel || darkAlt}
        aria-describedby={ariaDescribedby}
        aria-hidden={ariaHidden}
        role={role}
        title={title || darkAlt}
        draggable={false}
        {...props}
      />
    );
  },
);

LogoDark.displayName = "LogoDark";

export const LogoWhite = forwardRef<HTMLImageElement, LogoProps>(
  (
    {
      className,
      size = 120,
      alt = "The Codex Logo",
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedby,
      "aria-hidden": ariaHidden = false,
      role = "img",
      title,
      ...props
    },
    ref,
  ) => {
    const whiteAlt = `${alt} (white version)`;

    return (
      <Image
        ref={ref}
        src="/static/logo/logo-white.svg"
        alt={alt}
        width={size}
        height={size}
        className={cn("shrink-0 select-none", className)}
        aria-label={ariaLabel || whiteAlt}
        aria-describedby={ariaDescribedby}
        aria-hidden={ariaHidden}
        role={role}
        title={title || whiteAlt}
        draggable={false}
        {...props}
      />
    );
  },
);

LogoWhite.displayName = "LogoWhite";

export const LogoCompact = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    iconSize?: number;
    textSize?: "sm" | "base" | "lg" | "none";
    orientation?: "horizontal" | "vertical";
    "aria-label"?: string;
    "aria-describedby"?: string;
    "aria-hidden"?: boolean;
    role?: string;
    tabIndex?: number;
    onClick?: () => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
  }
>(
  (
    {
      className,
      iconSize = 24,
      textSize = "base",
      orientation = "horizontal",
      "aria-label": ariaLabel = "The Codex - Navigate to homepage",
      "aria-describedby": ariaDescribedby,
      "aria-hidden": ariaHidden = false,
      role = "banner",
      tabIndex,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const textSizeClasses = {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      none: "text-transparent",
    };

    const orientationClasses = {
      horizontal: "flex-row items-center gap-2",
      vertical: "flex-col items-center gap-1",
    };

    const isInteractive = onClick || onKeyDown;

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (onKeyDown) {
        onKeyDown(e);
      } else if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex select-none font-semibold",
          orientationClasses[orientation],
          isInteractive &&
            "focus:ring-ring cursor-pointer rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2",
          className,
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        aria-hidden={ariaHidden}
        role={role}
        tabIndex={isInteractive ? (tabIndex ?? 0) : tabIndex}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <Icon size={iconSize} aria-hidden={true} role="presentation" />
        <span
          className={cn("text-foreground", textSizeClasses[textSize])}
          aria-hidden={ariaHidden}
        >
          The Codex
        </span>
      </div>
    );
  },
);

LogoCompact.displayName = "LogoCompact";
