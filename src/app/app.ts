import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { MobileNavComponent } from "./components/mobile-nav/mobile-nav.component";
import { TopBarComponent } from "./components/top-bar/top-bar.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, MobileNavComponent, TopBarComponent],
  templateUrl: "./app.html",
})
export class App {
  sidebarCollapsed = false;

  workspace: "personal" | "business" = "personal";

  userName = "Stella Diver";

  plan = "Free";
}
