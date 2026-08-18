import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MobileNavComponent } from './components/mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    RouterOutlet,
    SidebarComponent,
    MobileNavComponent,
  ],

  templateUrl: './app.html',
})
export class App {
  sidebarCollapsed = false;

  workspace: 'personal' | 'business' = 'personal';

  userName = 'Ana Gomes';

  plan = 'Free';
}
