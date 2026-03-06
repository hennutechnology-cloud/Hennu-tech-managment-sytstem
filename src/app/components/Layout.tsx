// ============================================================
// Layout.tsx
// Project switcher now reads from ProjectContext so it always
// shows the same list as the Projects page, and clicking a
// project in the sidebar selects it in ProjectDetails too.
// ============================================================
import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard, Building2, BookOpen, FileText, BookMarked,
  Scale, TrendingUp, Landmark, TrendingDown, BarChart3,
  Sparkles, Settings, Menu, X, ChevronDown, Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { tLayout, ROUTE_LABEL_KEYS } from "../core/i18n/layout.i18n";
import { useLang }           from "../core/context/LangContext";
import { useProjectContext } from "../core/context/ProjectContext";

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

export default function Layout() {
  const [collapsed,            setCollapsed]            = useState(false);
  const [projectDropdownOpen,  setProjectDropdownOpen]  = useState(false);

  const { lang }                                        = useLang();
  const { projects, selectedProject, setSelectedProject, projectsLoading }
                                                        = useProjectContext();
  const location = useLocation();

  const isRtl        = lang === "ar";
  const dir          = isRtl ? "rtl" : "ltr";
  const sidebarSide  = isRtl ? { right: 0 } : { left: 0 };
  const borderSide   = isRtl ? "border-l"   : "border-r";
  const hoverSlide   = isRtl ? -4            : 4;
  const indicatorCls = isRtl ? "mr-auto"     : "ml-auto";
  const textAlign    = isRtl ? "text-right"  : "text-left";

  const onProjectPage = location.pathname === "/projects";

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
                  <h1 className="font-bold text-white">Hennu Tech</h1>
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

        {/* ── Project Switcher ── */}
        {!collapsed && (
          <div className="p-4 border-b border-white/10">
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              disabled={projectsLoading}
              className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-4 h-4 text-[#F97316] shrink-0" />
                <span className="text-sm truncate">
                  {projectsLoading
                    ? "…"
                    : selectedProject?.name ?? tLayout(lang, "projectKingdom")}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform shrink-0 ${
                  projectDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {projectDropdownOpen && !projectsLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 bg-white/5 rounded-xl overflow-hidden"
                >
                  {projects.map((project) => {
                    const isSelected = project.id === selectedProject?.id;
                    return (
                      <button
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project);
                          setProjectDropdownOpen(false);
                        }}
                        className={`
                          w-full flex items-center justify-between gap-2 px-3 py-2.5
                          text-sm transition-colors ${textAlign}
                          ${isSelected
                            ? "bg-orange-500/15 text-orange-300"
                            : "hover:bg-white/10 text-gray-300"
                          }
                        `}
                      >
                        <span className="truncate">{project.name}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
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
          transition:  "margin 0.3s ease",
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
