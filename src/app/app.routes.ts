import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "dashboard",
  },
  {
    path: "dashboard",
    title: "Dashboard — Luma",
    loadComponent: () =>
      import("./components/dashboard/dashboard.component").then((m) => m.DashboardComponent),
  },
  {
    path: "analytics",
    title: "Analytics — Luma",
    loadComponent: () =>
      import("./components/analytics/analytics.component").then((m) => m.AnalyticsPageComponent),
  },
  {
    path: "budget",
    title: "Budgets & Goals — Luma",
    loadComponent: () =>
      import("./components/budget/budget.component").then((m) => m.BudgetPageComponent),
  },
  {
    path: "business",
    title: "Business — Luma",
    loadComponent: () =>
      import("./components/business/business.component").then((m) => m.BusinessComponent),
  },
  {
    path: "help",
    title: "Help — Luma",
    loadComponent: () =>
      import("./components/help/help.component").then((m) => m.HelpComponent),
  },
  {
    path: "investments",
    title: "Investments — Luma",
    loadComponent: () =>
      import("./components/investments/investments.component").then(
        (m) => m.InvestmentsComponent,
      ),
  },
  {
    path: "reports",
    title: "Reports — Luma",
    loadComponent: () =>
      import("./components/reports/reports.component").then((m) => m.ReportsComponent),
  },
  {
    path: "settings",
    title: "Settings — Luma",
    loadComponent: () =>
      import("./components/settings/settings.component").then((m) => m.SettingsComponent),
  },
  {
    path: "transactions",
    title: "Transactions — Luma",
    loadComponent: () =>
      import("./components/transactions/transactions.component").then(
        (m) => m.TransactionsComponent,
      ),
  },
  {
    path: "wallets",
    title: "Wallets — Luma",
    loadComponent: () =>
      import("./components/wallets/wallets.component").then((m) => m.WalletsComponent),
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
];
