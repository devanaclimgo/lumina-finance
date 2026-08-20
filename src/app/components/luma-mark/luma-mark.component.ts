import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-luma-mark",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./luma-mark.component.html",
})
export class LumaMarkComponent {
  @Input() className = "h-9 w-9";
}
