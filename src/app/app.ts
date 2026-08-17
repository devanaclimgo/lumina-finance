import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LumaMarkComponent } from "./components/luma-mark.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LumaMarkComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: '../styles.css',
})
export class App {
  protected readonly title = signal('lumina-finance');
}
