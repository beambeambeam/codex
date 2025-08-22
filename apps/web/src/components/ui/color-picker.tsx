"use client";

import { forwardRef, useMemo } from "react";
import { HexColorPicker } from "react-colorful";

import { Input } from "@/components/ui/input";
import { useForwardedRef } from "@/lib/hooks/use-forwarded-ref";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
}

const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ value, onChange, onBlur, className, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);

    const parsedValue = useMemo(() => {
      return value || "#FFFFFF";
    }, [value]);

    return (
      <div className={cn("flex flex-col gap-2", className)} {...props}>
        <HexColorPicker color={parsedValue} onChange={onChange} />
        <Input
          maxLength={7}
          onChange={(e) => {
            onChange(e?.currentTarget?.value);
          }}
          onBlur={onBlur}
          ref={ref}
          value={parsedValue}
        />
      </div>
    );
  },
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
