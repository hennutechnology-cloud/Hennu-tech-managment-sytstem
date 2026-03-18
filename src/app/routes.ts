// ============================================================
// router.tsx — updated with /procurement route
// ============================================================
import { createBrowserRouter } from "react-router";
import Layout             from "./components/Layout";
import Dashboard          from "./pages/Dashboard";
import Projects           from "./pages/Projects";
import BOQComparison      from "./pages/BOQComparison";
import BOQManagement      from "./pages/BOQManagement";
import Contract           from "./pages/Contracts";
import ChartOfAccounts    from "./pages/ChartOfAccounts";
import JournalEntries     from "./pages/JournalEntries";
import GeneralLedger      from "./pages/GeneralLedger";
import TrialBalance       from "./pages/TrialBalance";
import IncomeStatement    from "./pages/IncomeStatement";
import BalanceSheet       from "./pages/BalanceSheet";
import Depreciation       from "./pages/Depreciation";
import AnalyticalReports  from "./pages/AnalyticalReports";
import AIAnalytics        from "./pages/AIAnalytics";
import Settings           from "./pages/Settings";
import Procurement        from "./pages/Procurement";
import Inventory          from "./pages/Inventory";
import Invoices           from "./pages/Invoices";
import Categories         from "./pages/Categories";
import Subcontractors from "./pages/Subcontractors";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,                      Component: Dashboard          },
      { path: "projects",                 Component: Projects           },
      { path: "boq-comparison",           Component: BOQComparison      },
      { path: "boq-management",           Component: BOQManagement      },
      { path: "contracts",                Component: Contract           },
      { path: "subcontractors",           Component: Subcontractors },
      { path: "chart-of-accounts",        Component: ChartOfAccounts    },
      { path: "journal-entries",          Component: JournalEntries     },
      { path: "general-ledger",           Component: GeneralLedger      },
      { path: "trial-balance",            Component: TrialBalance       },
      { path: "income-statement",         Component: IncomeStatement    },
      { path: "balance-sheet",            Component: BalanceSheet       },
      { path: "depreciation",             Component: Depreciation       },
      { path: "analytical-reports",       Component: AnalyticalReports  },
      { path: "ai-analytics",             Component: AIAnalytics        },
      { path: "procurement",              Component: Procurement        },
      { path: "inventory",                Component: Inventory          },
      { path: "invoices",                 Component: Invoices           },
      { path: "categories",               Component: Categories          },
      { path: "settings",                 Component: Settings           },
    ],
  },
]);
