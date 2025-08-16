"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

interface AvatarItem {
  id: number;
  name: string;

  image: string;
}

interface AvatarGroupProps {
  items: AvatarItem[];
  className?: string;
  maxVisible?: number;
  size?: "sm" | "md" | "lg";
}

// Individual Avatar Component
const Avatar = ({
  item,
  index,
  totalItems,
  size,
  isHovered,
  onHover,
  onLeave,
}: {
  item: AvatarItem;
  index: number;
  totalItems: number;
  size: "sm" | "md" | "lg";
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div
      className="group relative flex items-center justify-center"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        marginLeft: index === 0 ? 0 : "-0.5rem",
        zIndex: totalItems - index,
      }}
    >
      <AnimatePresence mode="popLayout">
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
              },
            }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute -top-16 z-50 flex min-w-max flex-col items-center justify-center whitespace-nowrap rounded-xl border bg-white px-4 py-2 text-xs shadow-lg"
          >
            <div className="relative z-30 text-center text-base font-bold text-gray-900">
              {item.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05, zIndex: 100 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative"
      >
        {item.image ? (
          <Image
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className={cn(
              "border-background !rounded-full border-2 object-cover transition duration-300",
              sizeClasses[size],
            )}
          />
        ) : (
          <div
            className={cn(
              "border-background flex items-center justify-center rounded-full border-2 bg-gray-200 text-gray-500",
              sizeClasses[size],
            )}
          >
            {item.name[0]}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const AvatarGroup = ({
  items,
  className,
  maxVisible = 5,
  size = "md",
}: AvatarGroupProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const visibleItems = items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {visibleItems.map((item, index) => (
        <Avatar
          key={item.id}
          item={item}
          index={index}
          totalItems={visibleItems.length}
          size={size}
          isHovered={hoveredIndex === item.id}
          onHover={() => setHoveredIndex(item.id)}
          onLeave={() => setHoveredIndex(null)}
        />
      ))}

      {remainingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "border-background bg-muted text-muted-foreground flex items-center justify-center rounded-full border-2 font-medium",
            size === "sm"
              ? "h-8 w-8"
              : size === "md"
                ? "h-10 w-10"
                : "h-12 w-12",
            "ml-[-0.5rem]",
          )}
        >
          +{remainingCount}
        </motion.div>
      )}
    </div>
  );
};

export default AvatarGroup;
