import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LucideArrowDownLeft, LucideArrowUpRight } from "@lucide/angular";

import { Transaction } from "../../lib/finance-data";
import { formatCurrency, formatDate } from "../../lib/format";
import { cn } from "@shared/utils/cn";
import { CategoryDotComponent } from "../category-dot/category-dot.component";

@Component({
  selector: "app-transaction-item",
  standalone: true,
  imports: [CommonModule, CategoryDotComponent, LucideArrowDownLeft],
  templateUrl: "./transaction-item.component.html",
})
export class TransactionItemComponent {
  @Input({ required: true }) tx!: Transaction;
  @Input() walletName?: string;
  @Output() onClick = new EventEmitter<void>();

  readonly ArrowDownLeft = LucideArrowDownLeft;
  readonly ArrowUpRight = LucideArrowUpRight;

  get isIncome(): boolean {
    return this.tx.type === "income";
  }

  get formattedDate(): string {
    return formatDate(this.tx.date);
  }

  get formattedAmount(): string {
    return formatCurrency(this.tx.amount);
  }

  get iconWrapperClasses(): string {
    return cn(
      "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105",
      this.isIncome ? "bg-success/12 text-success" : "bg-primary/10 text-primary",
    );
  }

  get amountClasses(): string {
    return cn(
      "shrink-0 text-sm font-semibold num",
      this.isIncome ? "text-success" : "text-foreground",
    );
  }
}
