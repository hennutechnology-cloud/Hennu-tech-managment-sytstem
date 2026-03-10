// ============================================================
// Layout.tsx – fully responsive across mobile / tablet / desktop
// Project switcher is fully live — reflects real projects from
// ProjectContext, which is kept in sync by the Projects page.
// ============================================================
import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation }   from "react-router";
import {
  LayoutDashboard, Building2, BookOpen, FileText, BookMarked,
  Scale, TrendingUp, Landmark, TrendingDown, BarChart3,
  Sparkles, Settings, Menu, X, ChevronDown, Check,
  HardHat, DollarSign, GitCompareArrows, FolderOpen,
  Plus,ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { tLayout, ROUTE_LABEL_KEYS } from "../core/i18n/layout.i18n";
import { useLang }           from "../core/context/LangContext";
import { useProjectContext } from "../core/context/ProjectContext";

// ── Types ─────────────────────────────────────────────────────
type NavItem    = { path: string; icon: React.ElementType };
type NavSection = {
  labelEn:      string;
  labelAr:      string;
  accent:       string;       // Tailwind text-color class
  dividerColor: string;       // inline hex for the divider
  icon:         React.ElementType;
  items:        NavItem[];
};

// ── Navigation structure ──────────────────────────────────────
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
      { path: "/projects",       icon: Building2        },
      { path: "/contracts",      icon: GitCompareArrows },
      { path: "/boq-comparison", icon: GitCompareArrows },
      { path: "/boq-management", icon: GitCompareArrows },
      { path: "/procurement",    icon: ShoppingCart     },
      { path: "/inventory",      icon: FolderOpen       },
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

// Mobile bottom nav: first 5 most-used paths

const mobileBottomPaths = ["/", "/projects", "/contracts", "/procurement", "/ai-analytics"];
const allItems          = navSections.flatMap((s) => s.items);
const mobileBottomItems = mobileBottomPaths.map(
  (p) => allItems.find((i) => i.path === p)!
);

// ── Breakpoint hook ───────────────────────────────────────────
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

// ── Risk badge color ──────────────────────────────────────────
function riskDot(risk?: "low" | "medium" | "high") {
  if (risk === "high")   return "bg-red-400";
  if (risk === "medium") return "bg-orange-400";
  return "bg-emerald-400";
}

// ── Component ─────────────────────────────────────────────────
export default function Layout() {
  const bp = useBreakpoint();

  const [desktopCollapsed,    setDesktopCollapsed]    = useState(false);
  const [mobileDrawerOpen,    setMobileDrawerOpen]    = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { lang } = useLang();
  const {
    projects,
    selectedProject,
    setSelectedProject,
    projectsLoading,
  } = useProjectContext();

  const location = useLocation();

  const isRtl       = lang === "ar";
  const dir         = isRtl ? "rtl" : "ltr";
  const hoverSlide  = isRtl ? -4 : 4;
  const indicatorCls = isRtl ? "mr-auto" : "ml-auto";
  const textAlign   = isRtl ? "text-right" : "text-left";

  // Close mobile drawer on route change
  useEffect(() => { setMobileDrawerOpen(false); }, [location.pathname]);

  // Close project dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProjectDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-select first project when projects load / change
  useEffect(() => {
    if (!selectedProject && projects.length > 0) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject, setSelectedProject]);

  const collapsed =
    bp === "mobile"  ? true :
    bp === "tablet"  ? true :
    desktopCollapsed;

  const sidebarWidth = collapsed ? 80 : 280;

  // ── Project switcher label ────────────────────────────────
  const switcherLabel = projectsLoading
    ? tLayout(lang, "projectsLoading")
    : selectedProject
      ? selectedProject.name
      : projects.length === 0
        ? tLayout(lang, "noProjects")
        : tLayout(lang, "selectProject");

  // ── Shared sidebar content ────────────────────────────────
  const SidebarContent = ({ inDrawer = false }: { inDrawer?: boolean }) => {
    const showFull = !collapsed || inDrawer;

    return (
      <>
        {/* ── Logo + collapse toggle ── */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between gap-3">
            {showFull && (
              <motion.div
                initial={{ opacity: 0, x: isRtl ? 8 : -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 min-w-0"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-white text-sm leading-tight truncate">Hennu Tech</h1>
                  <p className="text-[10px] text-gray-500 truncate">{tLayout(lang, "appSubtitle")}</p>
                </div>
              </motion.div>
            )}

            {!showFull && (
              <div className="w-9 h-9 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}

            {inDrawer ? (
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            ) : bp === "desktop" ? (
              <button
                onClick={() => setDesktopCollapsed(!desktopCollapsed)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors shrink-0"
              >
                {collapsed
                  ? <Menu className="w-4 h-4 text-gray-400" />
                  : <X className="w-4 h-4 text-gray-400" />
                }
              </button>
            ) : null}
          </div>
        </div>

        {/* ── Project switcher (expanded only) ── */}
        {showFull && (
          <div className="p-3 border-b border-white/10" ref={dropdownRef}>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider px-1 mb-1.5">
              {lang === "ar" ? "المشروع الحالي" : "Active Project"}
            </p>

            <button
              onClick={() => setProjectDropdownOpen((v) => !v)}
              disabled={projectsLoading}
              className={`w-full flex items-center justify-between gap-2 p-2.5 rounded-xl transition-all
                ${projectDropdownOpen
                  ? "bg-orange-500/10 border border-orange-500/20"
                  : "bg-white/5 hover:bg-white/8 border border-transparent hover:border-white/10"
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Risk indicator dot */}
                {selectedProject && (
                  <span className={`w-2 h-2 rounded-full shrink-0 ${riskDot(selectedProject.riskLevel)}`} />
                )}
                {!selectedProject && !projectsLoading && (
                  <FolderOpen className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                )}
                <span className={`text-sm truncate ${
                  selectedProject ? "text-white font-medium" : "text-gray-500"
                }`}>
                  {switcherLabel}
                </span>
              </div>

              {/* Progress chip */}
              {selectedProject && (
                <span className="text-[10px] text-orange-400 font-mono bg-orange-500/10 px-1.5 py-0.5 rounded-md shrink-0">
                  {selectedProject.progress}%
                </span>
              )}

              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform shrink-0 ${
                projectDropdownOpen ? "rotate-180" : ""
              }`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {projectDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0,  scaleY: 1    }}
                  exit={{   opacity: 0, y: -6, scaleY: 0.95  }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  style={{ transformOrigin: "top" }}
                  className="mt-1.5 bg-[#0f1117] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50"
                >
                  {/* Project list */}
                  {projects.length === 0 ? (
                    <div className="px-4 py-5 text-center">
                      <FolderOpen className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 mb-1">{tLayout(lang, "noProjects")}</p>
                      <p className="text-[10px] text-gray-600">{tLayout(lang, "addFirstProject")}</p>
                      <Link
                        to="/projects"
                        onClick={() => setProjectDropdownOpen(false)}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        {lang === "ar" ? "إضافة مشروع" : "Add Project"}
                      </Link>
                    </div>
                  ) : (
                    <div className="max-h-56 overflow-y-auto">
                      {projects.map((project) => {
                        const isSelected = project.id === selectedProject?.id;
                        return (
                          <button
                            key={project.id}
                            onClick={() => {
                              setSelectedProject(project);
                              setProjectDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm
                              transition-colors ${textAlign}
                              ${isSelected
                                ? "bg-orange-500/15 text-orange-300"
                                : "hover:bg-white/5 text-gray-300"
                              }`}
                          >
                            {/* Risk dot */}
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${riskDot(project.riskLevel)}`} />

                            <span className="flex-1 truncate text-start">{project.name}</span>

                            {/* Progress */}
                            <span className={`text-[10px] font-mono shrink-0 ${
                              isSelected ? "text-orange-400" : "text-gray-600"
                            }`}>
                              {project.progress}%
                            </span>

                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Footer: count + go-to-projects link */}
                  {projects.length > 0 && (
                    <div className="border-t border-white/8 px-3 py-2 flex items-center justify-between">
                      <span className="text-[10px] text-gray-600">
                        {projects.length} {tLayout(lang, "projectCount")}
                      </span>
                      <Link
                        to="/projects"
                        onClick={() => setProjectDropdownOpen(false)}
                        className="text-[10px] text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        {lang === "ar" ? "إدارة المشاريع ←" : "Manage →"}
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Collapsed: small project dot ── */}
        {!showFull && selectedProject && (
          <div className="flex justify-center py-3 border-b border-white/10">
            <div
              title={selectedProject.name}
              className={`w-2.5 h-2.5 rounded-full ${riskDot(selectedProject.riskLevel)}`}
            />
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5">
          {navSections.map((section, sIdx) => {
            const SectionIcon = section.icon;

            return (
              <div key={section.labelEn} className={sIdx > 0 ? "mt-1" : ""}>

                {/* Section divider */}
                {showFull ? (
                  <div className="flex items-center gap-2 px-2 mb-1 mt-4">
                    <div className="h-px flex-1" style={{ background: section.dividerColor }} />
                    <div className={`flex items-center gap-1.5 ${section.accent}`}>
                      <SectionIcon className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.12em]">
                        {isRtl ? section.labelAr : section.labelEn}
                      </span>
                    </div>
                    <div className="h-px flex-1" style={{ background: section.dividerColor }} />
                  </div>
                ) : (
                  sIdx > 0 && (
                    <div
                      className="mx-3 my-2 h-px"
                      style={{ background: section.dividerColor }}
                    />
                  )
                )}

                {/* Nav items */}
                <div className="space-y-0.5">
                  {section.items.map(({ path, icon: Icon }) => {
                    const isActive = location.pathname === path;

                    return (
                      <Link key={path} to={path}>
                        <motion.div
                          whileHover={{ x: showFull ? hoverSlide : 0 }}
                          title={!showFull ? tLayout(lang, ROUTE_LABEL_KEYS[path]) : undefined}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer
                            ${!showFull ? "justify-center" : ""}
                            ${isActive
                              ? "bg-gradient-to-l from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/20"
                              : "hover:bg-white/[0.06] text-gray-400 hover:text-gray-200"
                            }`}
                        >
                          <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-white" : ""}`} />

                          {showFull && (
                            <span className={`text-sm font-medium leading-none ${isActive ? "text-white" : ""}`}>
                              {tLayout(lang, ROUTE_LABEL_KEYS[path])}
                            </span>
                          )}

                          {isActive && showFull && (
                            <motion.div
                              layoutId="activeIndicator"
                              className={`${indicatorCls} w-1.5 h-1.5 bg-white/80 rounded-full`}
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

        {/* ── Footer watermark ── */}
        {showFull && (
          <div className="p-4 border-t border-white/10">
            <div className="text-center text-[10px] text-gray-600">
              {tLayout(lang, "betaVersion")}
            </div>
          </div>
        )}
      </>
    );
  };

  const borderSide   = isRtl ? "border-l" : "border-r";
  const sidebarStyle = isRtl ? { right: 0 } : { left: 0 };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-foreground" dir={dir}>

      {/* ═══ DESKTOP / TABLET sidebar ═══ */}
      {bp !== "mobile" && (
        <motion.aside
          initial={false}
          animate={{ width: sidebarWidth }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={sidebarStyle}
          className={`fixed top-0 h-screen bg-gradient-to-b from-[#0F172A] to-[#1A2236]
                      ${borderSide} border-white/[0.07] z-50 flex flex-col overflow-hidden`}
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
            <div className="w-7 h-7 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-lg flex items-center justify-center shadow-md shadow-orange-500/30">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">Hennu Tech</span>
          </div>

          {/* Active project pill — tappable to go to projects */}
          <Link
            to="/projects"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg max-w-[130px] transition-colors"
          >
            {selectedProject && (
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${riskDot(selectedProject?.riskLevel)}`} />
            )}
            <span className="text-xs text-gray-300 truncate">
              {projectsLoading
                ? "…"
                : selectedProject?.name ?? tLayout(lang, "noProjects")}
            </span>
          </Link>
        </header>
      )}

      {/* ═══ MOBILE: full-screen drawer ═══ */}
      <AnimatePresence>
        {bp === "mobile" && mobileDrawerOpen && (
          <>
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.aside
              key="drawer-panel"
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              style={isRtl ? { right: 0 } : { left: 0 }}
              className="fixed top-0 h-full w-[280px] max-w-[85vw] bg-gradient-to-b
                         from-[#0F172A] to-[#1A2236] z-[51] flex flex-col shadow-2xl"
            >
              <SidebarContent inDrawer />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ═══ MOBILE: bottom nav ═══ */}
      {bp === "mobile" && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0F172A]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2">
          {mobileBottomItems.map(({ path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link key={path} to={path} className="flex-1 flex justify-center">
                <motion.div
                  whileTap={{ scale: 0.82 }}
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
          {/* "More" opens the full drawer */}
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
          marginRight:   bp !== "mobile" && isRtl  ? sidebarWidth : 0,
          marginLeft:    bp !== "mobile" && !isRtl ? sidebarWidth : 0,
          transition:    "margin 0.3s ease",
          paddingTop:    bp === "mobile" ? "56px"  : 0,
          paddingBottom: bp === "mobile" ? "64px"  : 0,
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
