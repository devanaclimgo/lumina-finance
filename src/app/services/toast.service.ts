import { Injectable, signal } from "@angular/core";

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

const DEFAULT_DURATION = 3200;

@Injectable({
  providedIn: "root",
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  success(message: string, duration = DEFAULT_DURATION): void {
    this.push(message, "success", duration);
  }

  error(message: string, duration = DEFAULT_DURATION): void {
    this.push(message, "error", duration);
  }

  info(message: string, duration = DEFAULT_DURATION): void {
    this.push(message, "info", duration);
  }

  dismiss(id: string): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private push(message: string, variant: ToastVariant, duration: number): void {
    const id = Math.random().toString(36).slice(2, 10);

    this.toasts.update((list) => [...list, { id, message, variant }]);

    setTimeout(() => this.dismiss(id), duration);
  }
}
