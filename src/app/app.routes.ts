import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "analytics",
    loadComponent: () =>
      import("./components/analytics/analytics.component").then((m) => m.AnalyticsPageComponent),
  },
  {
    path: "budget",
    title: "Budgets & Goals — Luma",
    loadComponent: () =>
      import("./components/budget/budget.component").then((m) => m.BudgetPageComponent),
  },
];
