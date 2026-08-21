import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import {
  LucideBell,
  LucideCheck,
  LucideMenu,
  LucideMonitor,
  LucideMoon,
  LucideSearch,
  LucideSun,
  LucideX,
} from "@lucide/angular";

import { WorkspaceSwitcher } from "../workspace-switcher/workspace-switcher.component";
import { LumaMarkComponent } from "../luma-mark/luma-mark.component";
import { NAV_ITEMS } from "../sidebar/sidebar.component";
import { FinanceStoreService, NotificationTone, ThemeMode } from "../../services/store.service";

interface Notification {
  title: string;
  meta: string;
  tone: NotificationTone;
}

interface ThemeOption {
  key: ThemeMode;
  label: string;
  icon: unknown;
}

@Component({
  selector: "app-top-bar",
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    WorkspaceSwitcher,
    LumaMarkComponent,

    LucideMenu,
    LucideX,
    LucideSearch,
    LucideBell,
    LucideSun,
    LucideMoon,
    LucideCheck,
  ],
  templateUrl: "./top-bar.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  private readonly store = inject(FinanceStoreService);

  readonly mobileMenuOpen = signal(false);
  readonly notificationsOpen = signal(false);
  readonly themeMenuOpen = signal(false);

  readonly theme = signal<ThemeMode>("system");

  readonly settings = signal({
    name: "Ana Gomes",
  });

  readonly workspace = signal<"personal" | "business">("personal");

  readonly today = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  readonly notifications: Notification[] = [
    {
      title: "Rent payment due in 6 days",
      meta: "Housing · $1,850.00",
      tone: "warning",
    },
    {
      title: "Salary received",
      meta: "Acme Corp · +$5,400.00",
      tone: "success",
    },
    {
      title: "Entertainment budget at 82%",
      meta: "Budget alert",
      tone: "warning",
    },
    {
      title: "Portfolio up 2.4% today",
      meta: "Investments",
      tone: "success",
    },
  ];

  readonly themes: ThemeOption[] = [
    {
      key: "light",
      label: "Light",
      icon: LucideSun,
    },
    {
      key: "dark",
      label: "Dark",
      icon: LucideMoon,
    },
    {
      key: "system",
      label: "System",
      icon: LucideMonitor,
    },
  ];

  readonly visibleNavItems = computed(() => {
    return NAV_ITEMS.filter(
      (item) => !("businessOnly" in item && item.businessOnly) || this.workspace() === "business",
    );
  });

  readonly initials = computed(() => {
    return this.settings()
      .name.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  });

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update((open) => !open);
    this.themeMenuOpen.set(false);
  }

  toggleThemeMenu(): void {
    this.themeMenuOpen.update((open) => !open);
    this.notificationsOpen.set(false);
  }

  setTheme(theme: ThemeMode): void {
    this.theme.set(theme);
    this.themeMenuOpen.set(false);

    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeMode): void {
    const html = document.documentElement;

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      html.classList.toggle("dark", prefersDark);
      return;
    }

    html.classList.toggle("dark", theme === "dark");
  }
}
