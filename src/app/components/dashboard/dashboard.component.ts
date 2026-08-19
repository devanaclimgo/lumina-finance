import { Component } from "@angular/core";
import { BarChartKey } from "../charts/bars-chart/bars-chart.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  barKeys: BarChartKey[] = [
    {
      key: "income",
      label: "Income",
      color: "oklch(var(--chart-3))",
    },
    {
      key: "expenses",
      label: "Expenses",
      color: "oklch(var(--chart-4))",
    },
  ];
}
