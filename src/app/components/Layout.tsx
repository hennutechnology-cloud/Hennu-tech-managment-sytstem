// ============================================================
// Layout.tsx – fully responsive across mobile / tablet / desktop
// ============================================================
import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard, Building2, BookOpen, FileText, BookMarked,
  Scale, TrendingUp, Landmark, TrendingDown, BarChart3,
  Sparkles, Settings, Menu, X, ChevronDown, Check,
  HardHat, DollarSign, GitCompareArrows,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { tLayout, ROUTE_LABEL_KEYS } from "../core/i18n/layout.i18n";
import { useLang }           from "../core/context/LangContext";
import { useProjectContext } from "../core/context/ProjectContext";

type NavItem = { path: string; icon: React.ElementType };
type NavSection = {
  labelEn: string;
  labelAr: string;
  accent: string;         // Tailwind text-color class for the label
  dividerColor: string;   // inline hex for the divider line
  icon: React.ElementType;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    labelEn: "Overview",
    labelAr: "نظرة عامة",
    accent: "text-gray-400",
    dividerColor: "#ffffff18",
    icon: LayoutDashboard,
    items: [
      { path: "/", icon: LayoutDashboard },
    ],
  },
  {
    labelEn: "Construction",
    labelAr: "المشاريع الإنشائية",
    accent: "text-sky-400",
    dividerColor: "#38bdf855",
    icon: HardHat,
    items: [
      { path: "/projects",       icon: Building2         },
      { path: "/boq-comparison", icon: GitCompareArrows  },
      { path: "/boq-management", icon: GitCompareArrows  },

    ],
  },
  {
    labelEn: "Finance",
    labelAr: "المحاسبة المالية",
    accent: "text-emerald-400",
    dividerColor: "#34d39955",
    icon: DollarSign,
    items: [
      { path: "/chart-of-accounts",  icon: BookOpen     },
      { path: "/journal-entries",    icon: FileText     },
      { path: "/general-ledger",     icon: BookMarked   },
      { path: "/trial-balance",      icon: Scale        },
      { path: "/income-statement",   icon: TrendingUp   },
      { path: "/balance-sheet",      icon: Landmark     },
      { path: "/depreciation",       icon: TrendingDown },
      { path: "/analytical-reports", icon: BarChart3    },
      { path: "/ai-analytics",       icon: Sparkles     },
    ],
  },
  {
    labelEn: "System",
    labelAr: "الإعدادات",
    accent: "text-gray-400",
    dividerColor: "#ffffff18",
    icon: Settings,
    items: [
      { path: "/settings", icon: Settings },
    ],
  },
];

// Flat list for mobile bottom nav (first 5 most-used paths)
const mobileBottomPaths = ["/", "/projects", "/journal-entries", "/balance-sheet", "/ai-analytics"];
const allItems: NavItem[] = navSections.flatMap((s) => s.items);
const mobileBottomItems = mobileBottomPaths.map(
  (p) => allItems.find((i) => i.path === p)!
);

function useBreakpoint() {
  const [bp, setBp] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setBp(w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return bp;
}

export default function Layout() {
  const bp = useBreakpoint();

  // Desktop: manual collapse.  Tablet: always collapsed.  Mobile: drawer.
  const [desktopCollapsed,  setDesktopCollapsed]  = useState(false);
  const [mobileDrawerOpen,  setMobileDrawerOpen]  = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const { lang } = useLang();
  const { projects, selectedProject, setSelectedProject, projectsLoading }
    = useProjectContext();
  const location = useLocation();

  const isRtl       = lang === "ar";
  const dir         = isRtl ? "rtl" : "ltr";
  const hoverSlide  = isRtl ? -4 : 4;
  const indicatorCls = isRtl ? "mr-auto" : "ml-auto";
  const textAlign   = isRtl ? "text-right" : "text-left";

  // Close mobile drawer on route change
  useEffect(() => { setMobileDrawerOpen(false); }, [location.pathname]);

  // Derived sidebar state
  const collapsed =
    bp === "mobile"  ? true :
    bp === "tablet"  ? true :
    desktopCollapsed;

  const sidebarWidth = collapsed ? 80 : 280;

  // ── Sidebar inner content (shared by desktop/tablet and mobile drawer) ──
  const SidebarContent = ({ inDrawer = false }: { inDrawer?: boolean }) => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {(!collapsed || inDrawer) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white leading-tight">Hennu Tech</h1>
                <p className="text-xs text-gray-400">{tLayout(lang, "appSubtitle")}</p>
              </div>
            </motion.div>
          )}

          {/* Collapse toggle — desktop only; close button in drawer */}
          {inDrawer ? (
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-auto"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          ) : bp === "desktop" ? (
            <button
              onClick={() => setDesktopCollapsed(!desktopCollapsed)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          ) : null}
        </div>
      </div>

      {/* Project Switcher */}
      {(!collapsed || inDrawer) && (
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
                          : "hover:bg-white/10 text-gray-300"}
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
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navSections.map((section, sIdx) => {
          const showLabel = !collapsed || inDrawer;
          const SectionIcon = section.icon;

          return (
            <div key={section.labelEn} className={sIdx > 0 ? "mt-2" : ""}>

              {/* ── Section divider ── */}
              {showLabel ? (
                <div className="flex items-center gap-2 px-2 mb-1 mt-3">
                  {/* Left line */}
                  <div className="h-px flex-1" style={{ background: section.dividerColor }} />
                  {/* Label with section icon */}
                  <div className={`flex items-center gap-1 ${section.accent}`}>
                    <SectionIcon className="w-3 h-3" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">
                      {isRtl ? section.labelAr : section.labelEn}
                    </span>
                  </div>
                  {/* Right line */}
                  <div className="h-px flex-1" style={{ background: section.dividerColor }} />
                </div>
              ) : (
                /* Collapsed: just a thin line */
                sIdx > 0 && (
                  <div
                    className="mx-3 my-2 h-px"
                    style={{ background: section.dividerColor }}
                  />
                )
              )}

              {/* ── Items ── */}
              <div className="space-y-0.5">
                {section.items.map(({ path, icon: Icon }) => {
                  const isActive = location.pathname === path;

                  return (
                    <Link key={path} to={path}>
                      <motion.div
                        whileHover={{ x: showLabel ? hoverSlide : 0 }}
                        title={!showLabel ? tLayout(lang, ROUTE_LABEL_KEYS[path]) : undefined}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                          ${showLabel ? "" : "justify-center"}
                          ${isActive
                            ? "bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/20"
                            : "hover:bg-white/5 text-gray-300"
                          }`}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                        {showLabel && (
                          <span className="text-sm font-medium">
                            {tLayout(lang, ROUTE_LABEL_KEYS[path])}
                          </span>
                        )}
                        {isActive && showLabel && (
                          <motion.div
                            layoutId="activeIndicator"
                            className={`${indicatorCls} w-2 h-2 bg-white rounded-full`}
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Watermark */}
      {(!collapsed || inDrawer) && (
        <div className="p-4 border-t border-white/10">
          <div className="text-center text-xs text-gray-500">
            {tLayout(lang, "betaVersion")}
          </div>
        </div>
      )}
    </>
  );

  // ── Border direction ──
  const borderSide = isRtl ? "border-l" : "border-r";
  const sidebarStyle = isRtl ? { right: 0 } : { left: 0 };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-foreground" dir={dir}>

      {/* ═══ DESKTOP / TABLET sidebar ═══ */}
      {bp !== "mobile" && (
        <motion.aside
          initial={false}
          animate={{ width: sidebarWidth }}
          style={sidebarStyle}
          className={`fixed top-0 h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]
                      ${borderSide} border-white/10 backdrop-blur-xl z-50 flex flex-col`}
        >
          <SidebarContent />
        </motion.aside>
      )}

      {/* ═══ MOBILE: top bar ═══ */}
      {bp === "mobile" && (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0F172A] border-b border-white/10 flex items-center justify-between px-4">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">Hennu Tech</span>
          </div>

          {/* Active project pill */}
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/15 rounded-lg max-w-[120px]">
            <span className="text-xs text-orange-300 truncate">
              {selectedProject?.name ?? "—"}
            </span>
          </div>
        </header>
      )}

      {/* ═══ MOBILE: full-screen drawer ═══ */}
      <AnimatePresence>
        {bp === "mobile" && mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Drawer panel */}
            <motion.aside
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              style={isRtl ? { right: 0 } : { left: 0 }}
              className="fixed top-0 h-full w-[280px] max-w-[85vw] bg-gradient-to-b
                         from-[#0F172A] to-[#1E293B] z-50 flex flex-col shadow-2xl"
            >
              <SidebarContent inDrawer />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══ MOBILE: bottom nav ═══ */}
      {bp === "mobile" && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0F172A] border-t border-white/10 flex items-center justify-around px-2">
          {mobileBottomItems.map(({ path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path} className="flex-1 flex justify-center">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${
                    isActive ? "text-orange-400" : "text-gray-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavDot"
                      className="w-1 h-1 rounded-full bg-orange-400"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
          {/* "More" opens the drawer */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex-1 flex justify-center"
          >
            <div className="flex flex-col items-center gap-0.5 p-2 text-gray-500">
              <Menu className="w-5 h-5" />
            </div>
          </button>
        </nav>
      )}

      {/* ═══ Main content ═══ */}
      <main
        style={{
          marginRight: bp !== "mobile" && isRtl  ? sidebarWidth : 0,
          marginLeft:  bp !== "mobile" && !isRtl ? sidebarWidth : 0,
          transition:  "margin 0.3s ease",
          paddingTop:  bp === "mobile" ? "56px"  : 0,     // top bar height
          paddingBottom: bp === "mobile" ? "64px" : 0,    // bottom nav height
        }}
        className="min-h-screen"
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
