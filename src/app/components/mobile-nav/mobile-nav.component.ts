import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { RouterLink, RouterLinkActive } from "@angular/router";

import { NAV_ITEMS, NavItem } from "../sidebar/sidebar.component";

@Component({
  selector: "app-mobile-nav",

  standalone: true,

  imports: [RouterLink, RouterLinkActive],

  templateUrl: "./mobile-nav.component.html",

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileNavComponent {
  @Input() workspace: "personal" | "business" = "personal";

  readonly navItems = NAV_ITEMS;

  get items(): NavItem[] {
    return this.navItems
      .filter((item) => !item.businessOnly || this.workspace === "business")
      .slice(0, 5);
  }
}
