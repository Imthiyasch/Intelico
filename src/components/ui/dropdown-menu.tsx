"use client";

import React, { useState, useRef, useEffect } from "react";

/* ── DropdownMenu ──────────────────────────────────────────── */
interface DropdownMenuProps {
  children: React.ReactNode;
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if ((child.type as any).displayName === "DropdownMenuTrigger") {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: () => setOpen((prev) => !prev),
          });
        }
        if ((child.type as any).displayName === "DropdownMenuContent") {
          return open ? child : null;
        }
        return child;
      })}
    </div>
  );
}

/* ── DropdownMenuTrigger ───────────────────────────────────── */
interface TriggerProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export function DropdownMenuTrigger({ children, disabled, className, onClick }: TriggerProps) {
  return (
    <button
      disabled={disabled}
      className={className}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

/* ── DropdownMenuContent ───────────────────────────────────── */
interface ContentProps {
  children: React.ReactNode;
  align?: "start" | "end" | "center";
}

export function DropdownMenuContent({ children, align = "end" }: ContentProps) {
  const alignStyle: React.CSSProperties =
    align === "end"
      ? { right: 0 }
      : align === "start"
      ? { left: 0 }
      : { left: "50%", transform: "translateX(-50%)" };

  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        zIndex: 50,
        minWidth: 160,
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        padding: "4px 0",
        ...alignStyle,
      }}
    >
      {children}
    </div>
  );
}
DropdownMenuContent.displayName = "DropdownMenuContent";

/* ── DropdownMenuItem ──────────────────────────────────────── */
interface ItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DropdownMenuItem({ children, className, onClick }: ItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "8px 14px",
        fontSize: 13,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#f8fafc")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      {children}
    </button>
  );
}
DropdownMenuItem.displayName = "DropdownMenuItem";
