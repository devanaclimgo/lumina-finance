import { Component, Input, computed, signal } from "@angular/core";
import { NgStyle } from "@angular/common";
import { CATEGORY_COLORS } from "../../lib/finance-data";

@Component({
  selector: "app-category-dot",
  standalone: true,
  imports: [NgStyle],
  templateUrl: "./category-dot.component.html",
})
export class CategoryDotComponent {
  @Input({ required: true }) set category(value: string) {
    this._category.set(value);
  }

  private _category = signal<string>("");

  backgroundColor = computed(() => {
    return CATEGORY_COLORS[this._category()] ?? "var(--muted-foreground)";
  });
}
