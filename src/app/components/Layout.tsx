import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  FileText,
  BookMarked,
  Scale,
  TrendingUp,
  Landmark,
  TrendingDown,
  BarChart3,
  Sparkles,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { tLayout, ROUTE_LABEL_KEYS } from "../core/i18n/layout.i18n";
import { useLang } from "../core/context/LangContext";

// ── Menu route → icon map ─────────────────────────────────────────────────────
const menuItems = [
  { path: "/",                   icon: LayoutDashboard },
  { path: "/projects",           icon: Building2       },
  { path: "/chart-of-accounts",  icon: BookOpen        },
  { path: "/journal-entries",    icon: FileText        },
  { path: "/general-ledger",     icon: BookMarked      },
  { path: "/trial-balance",      icon: Scale           },
  { path: "/income-statement",   icon: TrendingUp      },
  { path: "/balance-sheet",      icon: Landmark        },
  { path: "/depreciation",       icon: TrendingDown    },
  { path: "/analytical-reports", icon: BarChart3       },
  { path: "/ai-analytics",       icon: Sparkles        },
  { path: "/settings",           icon: Settings        },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const { lang } = useLang();                           // ← live from context
  const location = useLocation();

  const isRtl = lang === "ar";
  const dir   = isRtl ? "rtl" : "ltr";

  // ── Layout helpers (RTL <-> LTR) ────────────────────────
  const sidebarSide  = isRtl ? { right: 0 } : { left: 0 };
  const borderSide   = isRtl ? "border-l"   : "border-r";
  const hoverSlide   = isRtl ? -4            : 4;
  const indicatorCls = isRtl ? "mr-auto"     : "ml-auto";
  const textAlign    = isRtl ? "text-right"  : "text-left";

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-foreground" dir={dir}>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        style={sidebarSide}
        className={`fixed top-0 h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]
                    ${borderSide} border-white/10 backdrop-blur-xl z-50 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white">BuildFin AI</h1>
                  <p className="text-xs text-gray-400">{tLayout(lang, "appSubtitle")}</p>
                </div>
              </motion.div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Project Switcher */}
        {!collapsed && (
          <div className="p-4 border-b border-white/10">
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#F97316]" />
                <span className="text-sm">{tLayout(lang, "projectKingdom")}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${projectDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {projectDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 bg-white/5 rounded-xl overflow-hidden"
                >
                  <button className={`w-full p-3 ${textAlign} text-sm hover:bg-white/10 transition-colors`}>
                    {tLayout(lang, "projectWaha")}
                  </button>
                  <button className={`w-full p-3 ${textAlign} text-sm hover:bg-white/10 transition-colors`}>
                    {tLayout(lang, "projectNakheel")}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map(({ path, icon: Icon }) => {
            const isActive = location.pathname === path;

            return (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ x: collapsed ? 0 : hoverSlide }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/20"
                      : "hover:bg-white/5 text-gray-300"
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {!collapsed && (
                    <span className="text-sm font-medium">
                      {tLayout(lang, ROUTE_LABEL_KEYS[path])}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`${indicatorCls} w-2 h-2 bg-white rounded-full`}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Watermark */}
        {!collapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="text-center text-xs text-gray-500">
              {tLayout(lang, "betaVersion")}
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main
        style={{
          marginRight: isRtl ? (collapsed ? 80 : 280) : 0,
          marginLeft:  isRtl ? 0 : (collapsed ? 80 : 280),
          transition: "margin 0.3s ease",
        }}
        className="min-h-screen"
      >
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
