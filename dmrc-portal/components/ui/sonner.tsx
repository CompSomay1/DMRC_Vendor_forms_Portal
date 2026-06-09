"use client";

import * as React from "react";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ToastType = "success" | "info" | "warning" | "error" | "loading";

type ToastRecord = {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastListener = (toast: ToastRecord) => void;

export type ToasterProps = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  closeButton?: boolean;
  richColors?: boolean;
  toastOptions?: {
    duration?: number;
  };
};

const listeners = new Set<ToastListener>();
let toastId = 0;

function emitToast(type: ToastType, message: string, duration?: number) {
  const toast = {
    id: ++toastId,
    message,
    type,
    duration,
  };

  listeners.forEach((listener) => listener(toast));

  return toast.id;
}

export const toast = {
  success: (message: string, options?: { duration?: number }) =>
    emitToast("success", message, options?.duration),
  info: (message: string, options?: { duration?: number }) =>
    emitToast("info", message, options?.duration),
  warning: (message: string, options?: { duration?: number }) =>
    emitToast("warning", message, options?.duration),
  error: (message: string, options?: { duration?: number }) =>
    emitToast("error", message, options?.duration),
  loading: (message: string, options?: { duration?: number }) =>
    emitToast("loading", message, options?.duration),
};

const positionClasses: Record<NonNullable<ToasterProps["position"]>, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
};

const iconMap = {
  success: CircleCheckIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  error: OctagonXIcon,
  loading: Loader2Icon,
} satisfies Record<ToastType, React.ComponentType<{ className?: string }>>;

const accentClasses: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-red-200 bg-red-50 text-red-800",
  loading: "border-slate-200 bg-slate-50 text-slate-800",
};

function ToastItem({
  item,
  onClose,
  closeButton,
}: {
  item: ToastRecord;
  onClose: (id: number) => void;
  closeButton: boolean;
}) {
  const Icon = iconMap[item.type];

  return (
    <div
      className={cn(
        "flex min-w-[280px] max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur",
        accentClasses[item.type]
      )}
      role="status"
      aria-live="polite"
    >
      <Icon
        className={cn("mt-0.5 size-4 shrink-0", item.type === "loading" && "animate-spin")}
      />
      <p className="flex-1 text-sm font-medium leading-5">{item.message}</p>
      {closeButton && (
        <button
          type="button"
          onClick={() => onClose(item.id)}
          className="shrink-0 opacity-70 transition hover:opacity-100"
          aria-label="Close notification"
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  );
}

function Toaster({
  position = "top-right",
  closeButton = false,
  toastOptions,
}: ToasterProps) {
  const [items, setItems] = React.useState<ToastRecord[]>([]);

  React.useEffect(() => {
    const listener: ToastListener = (item) => {
      setItems((current) => [...current, item]);

      window.setTimeout(() => {
        setItems((current) => current.filter((toastItem) => toastItem.id !== item.id));
      }, item.duration ?? toastOptions?.duration ?? 4000);
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, [toastOptions?.duration]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-[100] flex flex-col gap-3",
        positionClasses[position]
      )}
    >
      {items.map((item) => (
        <div key={item.id} className="pointer-events-auto">
          <ToastItem
            item={item}
            onClose={(id) =>
              setItems((current) => current.filter((toastItem) => toastItem.id !== id))
            }
            closeButton={closeButton}
          />
        </div>
      ))}
    </div>
  );
}

export { Toaster };
