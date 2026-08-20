import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "analytics",
    loadComponent: () =>
      import("./components/analytics/analytics.component").then((m) => m.AnalyticsPageComponent),
  },
];
