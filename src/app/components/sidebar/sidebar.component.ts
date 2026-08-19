import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { RouterLink, RouterLinkActive } from "@angular/router";

import {
  LucideArrowLeftRight,
  LucideBarChart3,
  LucideBriefcase,
  LucideChevronLeft,
  LucideCircleHelp,
  LucideFileText,
  LucideLayoutDashboard,
  LucideLineChart,
  LucidePiggyBank,
  LucideSettings,
  LucideWallet,
} from "@lucide/angular";

import { LumaMarkComponent } from "../luma-mark.component";

export interface NavItem {
  to: string;
  label: string;
  icon: any;
  businessOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: LucideLayoutDashboard,
  },
  {
    to: "/transactions",
    label: "Transactions",
    icon: LucideArrowLeftRight,
  },
  {
    to: "/wallets",
    label: "Wallets",
    icon: LucideWallet,
  },
  {
    to: "/budget",
    label: "Budget",
    icon: LucidePiggyBank,
  },
  {
    to: "/investments",
    label: "Investments",
    icon: LucideLineChart,
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: LucideBarChart3,
  },
  {
    to: "/reports",
    label: "Reports",
    icon: LucideFileText,
  },
  {
    to: "/business",
    label: "Business",
    icon: LucideBriefcase,
    businessOnly: true,
  },
];

export const BOTTOM_ITEMS: NavItem[] = [
  {
    to: "/settings",
    label: "Settings",
    icon: LucideSettings,
  },
  {
    to: "/help",
    label: "Help & Support",
    icon: LucideCircleHelp,
  },
];

@Component({
  selector: "app-sidebar",
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive,
    LumaMarkComponent,
    LucideBarChart3,
    LucideBriefcase,
    LucideChevronLeft,
    LucideCircleHelp,
    LucideFileText,
    LucideLayoutDashboard,
    LucideLineChart,
    LucidePiggyBank,
    LucideSettings,
    LucideWallet,
  ],

  templateUrl: "./sidebar.component.html",

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input() collapsed = false;

  @Input() workspace: "personal" | "business" = "personal";

  @Input() userName = "Jane Doe";

  @Input() plan = "Free";

  @Output() toggle = new EventEmitter<void>();

  readonly navItems = NAV_ITEMS;

  readonly bottomItems = BOTTOM_ITEMS;

  get filteredNavItems(): NavItem[] {
    return this.navItems.filter((item) => !item.businessOnly || this.workspace === "business");
  }

  get initials(): string {
    return this.userName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  onToggle(): void {
    this.toggle.emit();
  }
}
