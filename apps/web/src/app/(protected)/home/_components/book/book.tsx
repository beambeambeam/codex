import React, { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface BookProps {
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  texture?: boolean;
  depth?: number;
  variant?: "default" | "simple";
  illustration?: React.ReactNode;
  width?: number;
}

export function Book(props: BookProps) {
  const {
    children,
    color = "#f50537",
    depth,
    texture,
    variant = "default",
    textColor,
    illustration,
    width,
  } = props;
  return (
    <div
      className={cn("group inline-block w-fit [perspective:900px]")}
      style={
        {
          "--book-color": color,
          "--text-color": textColor,
          "--book-depth": (depth || 4) + "cqw",
          "--book-width": (width || 196) + "px",
        } as React.CSSProperties
      }
    >
      <div className="relative aspect-[49/60] w-fit min-w-[calc(var(--book-width))] rotate-0 transition-transform duration-500 ease-out contain-inline-size [transform-style:preserve-3d] group-hover:[transform:rotateY(-20deg)_scale(1.066)translateX(-8px)]">
        <Stack
          align="stretch"
          className="border-border shadow-book absolute size-full overflow-hidden rounded-l rounded-r border bg-stone-100 dark:bg-stone-800"
        >
          {variant !== "simple" && (
            <Stack
              shrink
              grow
              direction="row"
              className={cn(
                "relative min-w-[calc(var(--book-width))] overflow-hidden bg-[var(--book-color)]",
              )}
            >
              <div className="bg-book-bind-bg absolute inset-y-0 min-w-[8.2%] opacity-100 mix-blend-overlay" />
              {illustration && (
                <div className="object-cover">{illustration}</div>
              )}
            </Stack>
          )}
          <Stack grow={variant === "simple"} direction="row" className="h-fit">
            <div className="bg-book-bind-bg h-full min-w-[8.2%] opacity-100 mix-blend-overlay" />
            <div className="w-full contain-inline-size">{children}</div>
          </Stack>
          {texture && (
            <div
              aria-hidden={true}
              className="absolute inset-0 bg-cover bg-no-repeat opacity-60 mix-blend-hard-light"
            />
          )}
        </Stack>
        <div
          aria-hidden={true}
          className="absolute top-[3px] h-[calc(100%-2*6px)] w-[calc(var(--book-depth)-2px)] bg-white"
          style={{
            transform:
              "translateX(calc(var(--book-width) - var(--book-depth) / 2 - 3px)) rotateY(90deg) translateX(calc(var(--book-depth) / 2))",
          }}
        />
        <div
          aria-hidden={true}
          className="book-bg absolute left-0 h-full w-full rounded-l-md rounded-r bg-[var(--book-color)]"
          style={{
            transform: "translateZ(calc(-1 * var(--book-depth)))",
          }}
        />
      </div>
    </div>
  );
}

type FlexAlignItems = "stretch" | "start" | "end" | "center";
type FlexJustifyContent =
  | "stretch"
  | "start"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly"
  | "center";

interface StackProps extends ComponentProps<"div"> {
  children: React.ReactNode;
  direction?: "column" | "row";
  align?: FlexAlignItems;
  justify?: FlexJustifyContent;
  gap?: number;
  padding?: number;
  grow?: boolean;
  shrink?: boolean;
  wrap?: boolean;
  className?: string;
}

function Stack(props: StackProps) {
  const {
    children,
    shrink = false,
    grow = false,
    justify = "start",
    align = "start",
    wrap = false,
    padding = 0,
    gap = 0,
    direction = "column",
    className,
    ...etc
  } = props;

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flex: "initial",
        flexDirection: direction,
        alignItems:
          align === "start"
            ? "flex-start"
            : align === "end"
              ? "flex-end"
              : align,
        justifyContent:
          justify === "start"
            ? "flex-start"
            : justify === "end"
              ? "flex-end"
              : justify,
        flexWrap: wrap ? "wrap" : "nowrap",
        flexGrow: grow ? 1 : 0,
        flexShrink: shrink ? 1 : 0,
        padding: padding * 4 + "px",
        gap: gap * 4 + "px",
      }}
      {...etc}
    >
      {children}
    </div>
  );
}

export { Stack };
