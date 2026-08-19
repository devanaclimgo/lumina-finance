import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-luma-mark",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="grid place-items-center rounded-xl gradient-primary shadow-[var(--shadow-glow)]"
      [ngClass]="className"
    >
      <svg viewBox="0 0 24 24" class="h-1/2 w-1/2" fill="none" aria-hidden="true">
        <path
          d="M6 4v11a5 5 0 0 0 5 5h7"
          stroke="currentColor"
          stroke-width="2.6"
          stroke-linecap="round"
          class="text-primary-foreground"
        />

        <circle cx="17.5" cy="7" r="2.6" class="fill-primary-foreground/70" />
      </svg>
    </div>
  `,
})
export class LumaMarkComponent {
  @Input() className = "h-9 w-9";
}
