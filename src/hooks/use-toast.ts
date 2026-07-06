"use client";

import { useState, useCallback } from "react";

export type ToastVariant = "default" | "destructive";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toastQueue: Toast[] = [];

function notify() {
  toastListeners.forEach((fn) => fn([...toastQueue]));
}

export function addToast(toast: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  toastQueue = [...toastQueue, { ...toast, id }];
  notify();
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    notify();
  }, 4000);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const subscribe = useCallback((fn: (toasts: Toast[]) => void) => {
    toastListeners.push(fn);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== fn);
    };
  }, []);

  const toast = useCallback((props: Omit<Toast, "id">) => {
    addToast(props);
  }, []);

  return { toast, toasts, subscribe };
}
