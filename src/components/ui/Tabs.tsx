"use client";

import { useState, type ReactNode, useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
  tabClassName?: string;
  size?: "sm" | "md" | "lg";
  layoutId?: string;
}

export function Tabs({
  tabs,
  value,
  defaultValue,
  onChange,
  className,
  tabClassName,
  size = "md",
  layoutId: customLayoutId,
}: TabsProps) {
  const generatedId = useId();
  const layoutId = customLayoutId || `fluid-tabs-${generatedId}`;

  // Mendukung controlled mode (via 'value') atau uncontrolled mode (via internal state)
  const isControlled = value !== undefined;
  const [internalActive, setInternalActive] = useState<string>(
    defaultValue || tabs[0]?.id || ""
  );

  const active = isControlled ? value : internalActive;

  const handleTabClick = (id: string) => {
    if (!isControlled) {
      setInternalActive(id);
    }
    onChange?.(id);
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs sm:px-3 sm:py-1.5",
    md: "px-3.5 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2",
    lg: "px-4 py-2 text-sm sm:text-base sm:px-5 sm:py-2.5",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/60 p-1 backdrop-blur-md transition-colors shadow-xs overflow-x-auto max-w-full scrollbar-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "group relative rounded-full outline-none transition-colors cursor-pointer select-none shrink-0",
              sizeClasses[size],
              tabClassName
            )}
          >
            {/* Active Pill Spring Indicator */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 28,
                  mass: 0.8,
                }}
                className="absolute inset-0 rounded-full border border-border/60 bg-background shadow-sm dark:bg-card dark:border-border"
              />
            )}

            {/* Content Container (Icon + Label + Badge) */}
            <motion.div
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              animate={{
                filter: isActive
                  ? ["blur(0px)", "blur(2px)", "blur(0px)"]
                  : "blur(0px)",
              }}
              className={cn(
                "relative z-10 flex items-center gap-1.5 sm:gap-2 transition-colors duration-200",
                isActive
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon && (
                <motion.div
                  animate={{ scale: isActive ? 1.05 : 1 }}
                  transition={{
                    scale: { type: "spring", stiffness: 300, damping: 15 },
                  }}
                  className="flex shrink-0 items-center justify-center [&_svg]:size-4"
                >
                  {tab.icon}
                </motion.div>
              )}

              <span className="whitespace-nowrap tracking-tight">{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
