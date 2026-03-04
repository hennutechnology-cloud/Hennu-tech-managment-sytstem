import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import JournalEntries from "./pages/JournalEntries";
import GeneralLedger from "./pages/GeneralLedger";
import TrialBalance from "./pages/TrialBalance";
import IncomeStatement from "./pages/IncomeStatement";
import BalanceSheet from "./pages/BalanceSheet";
import Depreciation from "./pages/Depreciation";
import AnalyticalReports from "./pages/AnalyticalReports";
import AIAnalytics from "./pages/AIAnalytics";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "projects", Component: Projects },
      { path: "chart-of-accounts", Component: ChartOfAccounts },
      { path: "journal-entries", Component: JournalEntries },
      { path: "general-ledger", Component: GeneralLedger },
      { path: "trial-balance", Component: TrialBalance },
      { path: "income-statement", Component: IncomeStatement },
      { path: "balance-sheet", Component: BalanceSheet },
      { path: "depreciation", Component: Depreciation },
      { path: "analytical-reports", Component: AnalyticalReports },
      { path: "ai-analytics", Component: AIAnalytics },
      { path: "settings", Component: Settings },
    ],
  },
]);
