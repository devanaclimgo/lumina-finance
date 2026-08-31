import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";

import { PageHeaderComponent } from "../page-header/page-header.component";
import { SectionCardComponent } from "../section-card/section-card.component";

import { FinanceStoreService, type ThemeMode } from "../../services/store.service";
import { ToastService } from "../../services/toast.service";
import type { Workspace } from "../../lib/finance-data";

interface NotifItem {
  key: string;
  label: string;
  hint: string;
}

const NOTIFS: NotifItem[] = [
  { key: "email", label: "Email notifications", hint: "Product news and account activity" },
  { key: "transactions", label: "Transaction alerts", hint: "Every time a new transaction lands" },
  { key: "budgets", label: "Budget warnings", hint: "When a category passes 75% of its limit" },
  { key: "investments", label: "Investment updates", hint: "Weekly portfolio performance digest" },
  { key: "weekly", label: "Weekly summary", hint: "A calm Monday recap of last week" },
];

const THEMES: { key: ThemeMode; label: string }[] = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
];

const PLANS = ["Free", "Premium", "Pro"] as const;

@Component({
  standalone: true,
  selector: "app-settings",
  imports: [FormsModule, NgClass, PageHeaderComponent, SectionCardComponent],
  templateUrl: "./settings.component.html",
})
export class SettingsComponent {
  readonly notifs = NOTIFS;
  readonly themes = THEMES;
  readonly plans = PLANS;
  readonly currencies = ["USD", "EUR", "GBP", "BRL"];
  readonly languages = ["English (US)", "English (UK)", "Português (BR)", "Español"];
  readonly timezones = ["America/New_York", "America/Sao_Paulo", "Europe/London", "Europe/Berlin"];

  name = signal("");
  email = signal("");

  constructor(
    readonly store: FinanceStoreService,
    private readonly toast: ToastService,
  ) {
    this.name.set(this.store.settings().name);
    this.email.set(this.store.settings().email);
  }

  initials(): string {
    return this.store
      .settings()
      .name.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("");
  }

  updateName(value: string): void {
    this.name.set(value);
  }

  updateEmail(value: string): void {
    this.email.set(value);
  }

  saveProfile(): void {
    this.store.updateSettings({ name: this.name(), email: this.email() });
    this.toast.success("Profile updated");
  }

  setTheme(theme: ThemeMode): void {
    this.store.setTheme(theme);
  }

  setDefaultWorkspace(value: string): void {
    const workspace = value as Workspace;
    this.store.updateSettings({ defaultWorkspace: workspace });
    this.store.setWorkspace(workspace);
  }

  setCurrency(value: string): void {
    this.store.updateSettings({ currency: value });
  }

  setLanguage(value: string): void {
    this.store.updateSettings({ language: value });
  }

  setTimezone(value: string): void {
    this.store.updateSettings({ timezone: value });
  }

  setIncludePending(value: boolean): void {
    this.store.updateSettings({ includePending: value });
  }

  toggleNotification(key: string, value: boolean): void {
    this.store.updateSettings({
      notifications: { ...this.store.settings().notifications, [key]: value },
    });
  }

  setPlan(plan: (typeof PLANS)[number]): void {
    this.store.updateSettings({ plan });
    this.toast.success(`Switched to ${plan}`);
  }

  resetDemo(): void {
    this.store.resetDemo();
    this.toast.success("Demo data restored");
  }
}
