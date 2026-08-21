import { Component, computed, signal } from "@angular/core";
import { LucideBriefcase, LucideUser } from "@lucide/angular";
import { NAV_ITEMS } from "../sidebar/sidebar.component";

export type ThemeProfile = "personal" | "business";

interface ThemeOption {
  key: ThemeProfile;
  label: string;
  icon: unknown;
}

@Component({
  selector: "app-workspace-switcher",
  standalone: true,
  imports: [],
  templateUrl: "./workspace-switcher.component.html",
})
export class WorkspaceSwitcher {
  readonly themes: ThemeOption[] = [
    { key: "personal", label: "Personal", icon: LucideUser },
    { key: "business", label: "Business", icon: LucideBriefcase },
  ];

  readonly mobileMenuOpen = signal(false);
  readonly notificationsOpen = signal(false);
  readonly themeMenuOpen = signal(false);

  readonly workspace = signal<ThemeProfile>("personal");

  readonly visibleNavItems = computed(() => {
    return NAV_ITEMS.filter(
      (item) => !("businessOnly" in item && item.businessOnly) || this.workspace() === "business",
    );
  });

  setWorkspace(theme: ThemeProfile): void {
    this.workspace.set(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeProfile): void {
    const html = document.documentElement;
    html.classList.toggle("business", theme === "business");
  }

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
}
