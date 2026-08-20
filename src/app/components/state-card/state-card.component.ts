import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { LucideArrowDownRight, LucideArrowUpRight, type LucideIcon } from "@lucide/angular";

import { AnimatedNumberComponent } from "../animated-number/animated-number.component";
import { formatCurrency, formatPercent } from "../../lib/format";
import { cn } from "@shared/utils/cn"

@Component({
  selector: "app-stat-card",
  standalone: true,
  imports: [LucideArrowDownRight, LucideArrowUpRight, AnimatedNumberComponent],
  templateUrl: "./state-card.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;

  @Input({ required: true }) value!: number;

  @Input() change?: number;

  @Input() hint?: string;

  @Input() icon?: LucideIcon;

  @Input() currency = "USD";

  @Input() featured = false;

  @Input() invertChange = false;

  @Input() delay = 0;

  get positive(): boolean {
    return (this.change ?? 0) >= 0;
  }

  get good(): boolean {
    return this.invertChange ? !this.positive : this.positive;
  }

  formatValue = (value: number): string => {
    return formatCurrency(value, this.currency);
  };

  formatChange(value: number): string {
    return formatPercent(value);
  }

  get iconClass(): string {
    return cn("h-4 w-4", this.featured ? "text-primary-foreground/80" : "text-muted-foreground");
  }
}
